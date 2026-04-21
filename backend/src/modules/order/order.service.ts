import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from 'src/interface/dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. KIỂM TRA & TRỪ SỐ LƯỢNG TỒN KHO (CHỐNG RACE CONDITION)
      for (const item of dto.items) {
        // CÚ PHÁP ATOMIC UPDATE: Ép Database tự trừ thẳng xuống
        const updatedVolume = await tx.volume.updateMany({
          where: {
            id: item.volumeId,
            stock: { gte: item.quantity }, // ĐIỀU KIỆN SỐNG CÒN: Kho phải >= số lượng muốn mua
          },
          data: {
            stock: { decrement: item.quantity }, // Trừ thẳng không cần lấy ra trước
            soldCount: { increment: item.quantity },
          },
        });

        // Nếu count === 0, tức là lệnh update bị từ chối (do hết hàng hoặc ai đó nẫng tay trên)
        if (updatedVolume.count === 0) {
          // Query nhẹ lại để lấy tên sách báo lỗi cho người dùng biết cuốn nào hết
          const volume = await tx.volume.findUnique({
            where: { id: item.volumeId },
          });

          if (!volume) throw new BadRequestException(`Sản phẩm không tồn tại.`);
          throw new BadRequestException(
            `Sản phẩm "${volume.title}" không đủ số lượng hoặc vừa có khách hàng khác mua mất. Sếp thông cảm nhé!`,
          );
        }

        // Ghi Log xuất kho
        await tx.inventoryTransaction.create({
          data: {
            volumeId: item.volumeId,
            type: 'EXPORT',
            quantity: -item.quantity,
            note: 'Xuất kho bán hàng',
          },
        });
      }

      // 2. LƯU ĐỊA CHỈ GIAO HÀNG (Address)
      const address = await tx.address.create({
        data: {
          userId,
          phone: dto.phone,
          street: dto.street,
          ward: dto.ward,
          district: dto.district,
          city: dto.city,
        },
      });

      // 3. TẠO ĐƠN HÀNG
      const order = await tx.order.create({
        data: {
          userId,
          addressId: address.id,
          totalAmount: dto.totalAmount,
          shippingFee: dto.shippingFee,
          finalAmount: dto.finalAmount,
          note: dto.note,
          status: 'PENDING',
          items: {
            create: dto.items.map((item) => ({
              volumeId: item.volumeId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          payment: {
            create: {
              method: dto.paymentMethod,
              status: 'PENDING',
            },
          },
        },
        include: {
          items: true,
          payment: true,
          address: true,
        },
      });

      return order;
    });
  }

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: { include: { volume: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId: userId },
      include: {
        items: { include: { volume: true } },
        payment: true,
        address: true,
      },
    });

    if (!order) {
      throw new BadRequestException(
        'Không tìm thấy đơn hàng hoặc sếp không có quyền xem!',
      );
    }
    return order;
  }

  async getOrderStats(userId: string) {
    const [pending, confirmed, shipping, delivered, cancelled, recentOrders] =
      await Promise.all([
        this.prisma.order.count({ where: { userId, status: 'PENDING' } }),
        this.prisma.order.count({ where: { userId, status: 'CONFIRMED' } }),
        this.prisma.order.count({ where: { userId, status: 'SHIPPING' } }),
        this.prisma.order.count({ where: { userId, status: 'DELIVERED' } }),
        this.prisma.order.count({ where: { userId, status: 'CANCELLED' } }),
        this.prisma.order.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            status: true,
            finalAmount: true,
            createdAt: true,
          },
        }),
      ]);

    return { pending, confirmed, shipping, delivered, cancelled, recentOrders };
  }

  // ==========================================
  // CÁC HÀM DÀNH CHO ADMIN
  // ==========================================

  async getAllOrdersForAdmin(
    pageStr?: string,
    limitStr?: string,
    search: string = '',
  ) {
    const page = Math.max(1, Number(pageStr) || 1);
    const limit = Math.max(1, Number(limitStr) || 10);
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? {
          OR: [
            { id: { contains: search } },
            {
              user: {
                name: { contains: search },
              },
            },
            {
              user: {
                email: { contains: search },
              },
            },
          ],
        }
      : {};

    const [totalItems, orders] = await Promise.all([
      this.prisma.order.count({ where: whereCondition }),
      this.prisma.order.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
          payment: true,
          address: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: orders,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async updateOrderStatusByAdmin(orderId: string, newStatus: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new BadRequestException('Không tìm thấy đơn hàng này!');
    if (order.status === 'CANCELLED')
      throw new BadRequestException('Đơn hàng đã HỦY');
    if (order.status === 'DELIVERED')
      throw new BadRequestException('Đơn hàng đã GIAO THÀNH CÔNG');

    if (newStatus === 'CANCELLED') {
      return await this.prisma.$transaction(async (tx) => {
        const cancelledOrder = await tx.order.update({
          where: { id: orderId },
          data: { status: newStatus },
        });

        for (const item of order.items) {
          await tx.volume.update({
            where: { id: item.volumeId },
            data: {
              stock: { increment: item.quantity },
              soldCount: { decrement: item.quantity },
            },
          });

          await tx.inventoryTransaction.create({
            data: {
              volumeId: item.volumeId,
              type: 'IMPORT',
              quantity: item.quantity,
              note: `Hoàn kho do Hủy đơn hàng #${orderId.substring(0, 8)}`,
            },
          });
        }
        return cancelledOrder;
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  }

  async updatePaymentStatusByAdmin(orderId: string, status: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId: orderId },
    });

    if (!payment) {
      throw new BadRequestException(
        'Không tìm thấy thông tin thanh toán của đơn hàng này!',
      );
    }

    return this.prisma.payment.update({
      where: { orderId: orderId },
      data: {
        status: status,
        ...(status === 'SUCCESS' ? { paidAt: new Date() } : {}),
      },
    });
  }
}

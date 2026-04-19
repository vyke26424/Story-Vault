import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from 'src/interface/dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // Sử dụng $transaction để đảm bảo mọi thao tác thành công 100% hoặc hoàn tác tất cả
    return await this.prisma.$transaction(async (tx) => {
      // 1. KIỂM TRA & TRỪ SỐ LƯỢNG TỒN KHO
      for (const item of dto.items) {
        const volume = await tx.volume.findUnique({
          where: { id: item.volumeId },
        });

        if (!volume) throw new BadRequestException(`Sản phẩm không tồn tại.`);
        if (volume.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${volume.title}" không đủ số lượng trong kho.`,
          );
        }

        // Trừ kho
        await tx.volume.update({
          where: { id: item.volumeId },
          data: { stock: volume.stock - item.quantity },
        });

        // Tạo log lịch sử xuất kho (InventoryTransaction)
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

      // 3. TẠO ĐƠN HÀNG (Order + OrderItem + Payment)
      const order = await tx.order.create({
        data: {
          userId,
          addressId: address.id,
          totalAmount: dto.totalAmount,
          shippingFee: dto.shippingFee,
          finalAmount: dto.finalAmount,
          note: dto.note,
          status: 'PENDING',
          // Tạo luôn danh sách sách (OrderItem)
          items: {
            create: dto.items.map((item) => ({
              volumeId: item.volumeId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          // Tạo luôn thông tin thanh toán (Payment)
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
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            volume: true, // Lấy thông tin sách để hiển thị ảnh và tên
          },
        },
        payment: true, // Lấy thông tin thanh toán để check xem là COD hay VIETQR
      },
      orderBy: {
        createdAt: 'desc', // Sắp xếp đơn hàng mới nhất lên đầu
      },
    });
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId, // Bảo mật: Chỉ lấy đơn của chính user này
      },
      include: {
        items: {
          include: { volume: true },
        },
        payment: true,
        address: true, // Quan trọng: Phải móc address ra để in lên hóa đơn
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
    // Dùng Promise.all để chạy 4 truy vấn song song cho tốc độ bàn thờ
    const [pending, confirmed, shipping, delivered, cancelled, recentOrders] =
      await Promise.all([
        // Đổi tên biến latestOrder thành recentOrders
        this.prisma.order.count({
          where: { userId, status: 'PENDING' },
        }),
        this.prisma.order.count({
          where: { userId, status: 'CONFIRMED' },
        }),
        this.prisma.order.count({
          where: { userId, status: 'SHIPPING' },
        }),
        this.prisma.order.count({
          where: { userId, status: 'DELIVERED' },
        }),
        this.prisma.order.count({
          where: { userId, status: 'CANCELLED' },
        }),
        // Lấy 3 đơn hàng gần nhất với thông tin tối giản
        this.prisma.order.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }, // Lấy đơn mới nhất
          take: 3,
          select: {
            id: true, // Chỉ lấy ID
            status: true, // Trạng thái
            finalAmount: true, // Tổng tiền
            createdAt: true, // Ngày tạo
          },
        }),
      ]);

    return {
      pending,
      confirmed,
      shipping,
      delivered,
      cancelled,
      recentOrders,
    };
  }

  // ==========================================
  // CÁC HÀM DÀNH CHO ADMIN
  // ==========================================

  async getAllOrdersForAdmin() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        payment: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatusByAdmin(orderId: string, newStatus: any) {
    // 1. Phải include items để lát nữa biết đường mà cộng lại kho
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new BadRequestException('Không tìm thấy đơn hàng này!');
    }

    // 2. KHIÊN BẢO VỆ: Chặn đổi trạng thái nếu đơn đã HỦY hoặc đã GIAO
    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Đơn hàng đã HỦY');
    }
    if (order.status === 'DELIVERED') {
      throw new BadRequestException('Đơn hàng đã GIAO THÀNH CÔNG');
    }

    // 3. NẾU ADMIN BẤM HỦY ĐƠN -> Hoàn kho & Ghi log (Dùng Transaction để an toàn tuyệt đối)
    if (newStatus === 'CANCELLED') {
      return await this.prisma.$transaction(async (tx) => {
        // 3.1. Cập nhật trạng thái thành CANCELLED
        const cancelledOrder = await tx.order.update({
          where: { id: orderId },
          data: { status: newStatus },
        });

        // 3.2. Vòng lặp cộng lại kho cho từng cuốn sách
        for (const item of order.items) {
          await tx.volume.update({
            where: { id: item.volumeId },
            // Dùng increment để cộng dồn vào số lượng kho hiện tại
            data: { stock: { increment: item.quantity } },
          });

          // 3.3. Ghi lại lịch sử để Admin kiểm toán sau này
          await tx.inventoryTransaction.create({
            data: {
              volumeId: item.volumeId,
              type: 'IMPORT', // Nhập lại vào kho
              quantity: item.quantity,
              note: `Hoàn kho do Hủy đơn hàng #${orderId.substring(0, 8)}`,
            },
          });
        }
        return cancelledOrder;
      });
    }

    // 4. Nếu là các trạng thái khác (PENDING -> CONFIRMED -> SHIPPING) thì cứ update bình thường
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  }
}

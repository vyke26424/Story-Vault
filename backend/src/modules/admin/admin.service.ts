import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count({
      where: { role: 'CUSTOMER' },
    });
    const totalOrders = await this.prisma.order.count({
      where: { status: { not: 'CANCELLED' } },
    });

    const revenueAgg = await this.prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: { status: 'DELIVERED' },
    });
    const totalRevenue = revenueAgg._sum.finalAmount || 0;

    const stockAgg = await this.prisma.volume.aggregate({
      _sum: { stock: true },
    });
    const totalStock = stockAgg._sum.stock || 0;

    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    // LẤY TOP 5 SẢN PHẨM BÁN CHẠY NHẤT
    const topSellingProducts = await this.prisma.volume.findMany({
      take: 5,
      orderBy: { soldCount: 'desc' }, // Lấy bán nhiều nhất đẩy lên đầu
      where: { soldCount: { gt: 0 } }, // Bỏ qua mấy cuốn chưa bán được cuốn nào
      select: {
        id: true,
        title: true,
        coverImage: true,
        soldCount: true,
        price: true,
        series: { select: { title: true } },
      },
    });

    // TÍNH DOANH THU 7 NGÀY GẦN NHẤT CHO BIỂU ĐỒ
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 ngày tính cả hôm nay
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const orders7Days = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: 'DELIVERED', // Chỉ tính tiền đơn đã giao
      },
      select: { createdAt: true, finalAmount: true },
    });

    // Tạo mảng 7 ngày (Thứ 2, Thứ 3... hoặc ngày/tháng)
    const chartData: { name: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      });

      // Cộng dồn tiền của các đơn trong ngày d
      const totalInDay = orders7Days
        .filter(
          (o) => new Date(o.createdAt).toDateString() === d.toDateString(),
        )
        .reduce((sum, o) => sum + Number(o.finalAmount), 0);

      chartData.push({
        name: dateString,
        revenue: totalInDay,
      });
    }

    return {
      totalUsers,
      totalOrders,
      totalRevenue,
      totalStock,
      recentOrders,
      chartData,
      topSellingProducts,
    };
  }
}

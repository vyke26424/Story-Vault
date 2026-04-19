import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. LIVE SEARCH PREVIEW (Lấy 5 kết quả nhanh)
   * Hiển thị ngay khi người dùng đang gõ ở Header
   */
  async getPreview(q: string) {
    if (!q) return [];

    const { searchString, volumeNumber } = this.parseSmartQuery(q);

    return this.prisma.volume.findMany({
      where: {
        isActive: true,
        AND: [
          searchString ? {
            OR: [
              { title: { contains: searchString } },
              { series: { title: { contains: searchString } } },
            ],
          } : {},
          volumeNumber ? { volumeNumber: volumeNumber } : {},
        ],
      },
      include: {
        series: {
          select: { title: true, author: true },
        },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 2. FULL SEARCH (Kết quả chi tiết tại SearchPage)
   * Hỗ trợ: Từ khóa, Thể loại, Khoảng giá, Sắp xếp
   */
  async getFullSearch(
    q: string,
    sort: string,
    type: string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    const { searchString, price: parsedPrice, volumeNumber } = this.parseSmartQuery(q || "");

    // Khởi tạo điều kiện lọc
    const where: Prisma.VolumeWhereInput = {
      isActive: true,
      AND: [],
    };

    const andConditions = where.AND as Prisma.VolumeWhereInput[];

    // Lọc theo chuỗi tìm kiếm (Tên truyện/Tập/Tác giả)
    if (searchString) {
      andConditions.push({
        OR: [
          { title: { contains: searchString } },
          { series: { title: { contains: searchString } } },
          { series: { author: { contains: searchString } } },
        ],
      });
    }

    // Lọc theo Số tập (Nếu khách gõ số nhỏ trong ô search)
    if (volumeNumber) {
      andConditions.push({ volumeNumber: volumeNumber });
    }

    // Lọc theo Thể loại (MANGA, LIGHT_NOVEL...)
    if (type) {
      andConditions.push({ series: { type: type as any } });
    }

    // Lọc theo Khoảng giá (Ưu tiên giá từ bộ lọc Sidebar, sau đó đến giá trong ô search)
    const finalMin = minPrice ? Number(minPrice) : (parsedPrice ? parsedPrice - 5000 : undefined);
    const finalMax = maxPrice ? Number(maxPrice) : (parsedPrice ? parsedPrice + 5000 : undefined);

    if (finalMin || finalMax) {
      andConditions.push({
        price: {
          ...(finalMin ? { gte: finalMin } : {}),
          ...(finalMax ? { lte: finalMax } : {}),
        },
      });
    }

    // Xử lý Sắp xếp
    let orderBy: Prisma.VolumeOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    return this.prisma.volume.findMany({
      where,
      include: {
        series: {
          select: { title: true, author: true, type: true },
        },
      },
      orderBy,
    });
  }

  /**
   * HÀM PHỤ TRỢ: Tách thông tin thông minh từ chuỗi gõ vào
   * Ví dụ: "Naruto 10 25000" -> { searchString: "Naruto", volumeNumber: 10, price: 25000 }
   */
  private parseSmartQuery(q: string) {
    let searchString = q.toLowerCase();
    let price: number | null = null;
    let volumeNumber: number | null = null;

    // 1. Tìm giá tiền (Số >= 1000)
    const priceMatch = q.match(/\d{4,}/);
    if (priceMatch) {
      price = parseInt(priceMatch[0]);
      searchString = searchString.replace(priceMatch[0], '');
    }

    // 2. Tìm số tập (Số từ 1-3 chữ số đứng riêng lẻ)
    const volumeMatch = searchString.match(/\b\d{1,3}\b/);
    if (volumeMatch) {
      volumeNumber = parseInt(volumeMatch[0]);
      searchString = searchString.replace(volumeMatch[0], '');
    }

    return {
      searchString: searchString.trim(),
      price,
      volumeNumber,
    };
  }
}
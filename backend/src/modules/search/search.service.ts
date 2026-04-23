import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Hàm hỗ trợ: Tạo các biến thể tìm kiếm cho chữ "d" và "đ"
   * (Do MySQL không tự động phân biệt chữ d và đ khi tìm kiếm text)
   */
  private generateVietnameseVariations(str: string): string[] {
    if (!str) return [];
    const variations = new Set<string>();
    variations.add(str);

    if (str.includes('d') || str.includes('đ')) {
      variations.add(str.replace(/d/g, 'đ')); // Chuyển d thành đ
      variations.add(str.replace(/đ/g, 'd')); // Chuyển đ thành d
    }
    return Array.from(variations);
  }

  /**
   * 1. LIVE SEARCH PREVIEW (Lấy 5 kết quả nhanh)
   * Hiển thị ngay khi người dùng đang gõ ở Header
   */
  async getPreview(q: string, includeOutOfStock: boolean = false) {
    if (!q) return [];

    const { searchString, volumeNumber } = this.parseSmartQuery(q);

    const searchVariations = this.generateVietnameseVariations(searchString);
    const searchOrs = searchVariations.flatMap((str) => [
      { title: { contains: str } },
      { series: { title: { contains: str } } },
    ]);

    const andConditions: Prisma.VolumeWhereInput[] = [
      searchString ? { OR: searchOrs } : {},
      volumeNumber ? { volumeNumber: volumeNumber } : {},
    ];

    if (!includeOutOfStock) {
      andConditions.push({ stock: { gt: 0 } });
    }

    return this.prisma.volume.findMany({
      where: {
        isActive: true,
        AND: andConditions,
      },
      include: {
        series: {
          select: { title: true, author: true, slug: true },
        },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFullSearch(query: any) {
    // 1. Lấy tất cả tham số từ Frontend gửi lên
    const {
      q,
      sort,
      type,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      includeOutOfStock,
    } = query;
    const {
      searchString,
      price: parsedPrice,
      volumeNumber,
    } = this.parseSmartQuery(q || '');

    // Khởi tạo điều kiện lọc
    const where: Prisma.VolumeWhereInput = {
      isActive: true,
      AND: [],
    };

    const andConditions = where.AND as Prisma.VolumeWhereInput[];

    // Lọc theo chuỗi tìm kiếm (Tên truyện/Tập/Tác giả)
    if (searchString) {
      const searchVariations = this.generateVietnameseVariations(searchString);
      const searchOrs = searchVariations.flatMap((str) => [
        { title: { contains: str } },
        { series: { title: { contains: str } } },
        { series: { author: { contains: str } } },
      ]);

      andConditions.push({
        OR: searchOrs,
      });
    }

    // Lọc theo Số tập
    if (volumeNumber) {
      andConditions.push({ volumeNumber: volumeNumber });
    }

    // Lọc theo Thể loại
    if (type) {
      andConditions.push({ series: { type: type as any } });
    }

    // Lọc theo Khoảng giá
    const finalMin = minPrice
      ? Number(minPrice)
      : parsedPrice
        ? parsedPrice - 5000
        : undefined;
    const finalMax = maxPrice
      ? Number(maxPrice)
      : parsedPrice
        ? parsedPrice + 5000
        : undefined;

    if (finalMin || finalMax) {
      andConditions.push({
        price: {
          ...(finalMin ? { gte: finalMin } : {}),
          ...(finalMax ? { lte: finalMax } : {}),
        },
      });
    }

    // Lọc theo Tồn kho (Mặc định ẩn sản phẩm hết hàng nếu không có yêu cầu)
    if (includeOutOfStock !== 'true' && includeOutOfStock !== true) {
      andConditions.push({ stock: { gt: 0 } });
    }

    // Xử lý Sắp xếp
    let orderBy: Prisma.VolumeOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'sold_desc') orderBy = { soldCount: 'desc' };

    const currentPage = Number(page);
    const take = Number(limit);
    const skip = (currentPage - 1) * take;

    const [totalItems, data] = await Promise.all([
      this.prisma.volume.count({ where }),
      this.prisma.volume.findMany({
        where,
        include: {
          series: {
            select: { title: true, author: true, type: true, slug: true }, // Nhớ lấy slug để frontend link cho chuẩn
          },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    return {
      data,
      meta: {
        totalItems,
        currentPage,
        totalPages: Math.ceil(totalItems / take),
      },
    };
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
    const priceMatch = searchString.match(/\d{4,}/);
    if (priceMatch) {
      price = parseInt(priceMatch[0]);
      searchString = searchString.replace(priceMatch[0], '');
    }

    // 2. Tìm số tập (hỗ trợ bắt các từ khóa tập, tap, vol... dính liền với số)
    const volKeywordRegex =
      /\b(tập|tap|vol|volume|quyển|quyen|cuốn|cuon)\s*(\d{1,3})\b/i;
    const volumeKeywordMatch = searchString.match(volKeywordRegex);

    if (volumeKeywordMatch) {
      volumeNumber = parseInt(volumeKeywordMatch[2]);
      searchString = searchString.replace(volumeKeywordMatch[0], '');
    } else {
      // Nếu không có chữ đi trước thì tìm số đứng độc lập
      const singleVolumeMatch = searchString.match(/\b\d{1,3}\b/);
      if (singleVolumeMatch) {
        volumeNumber = parseInt(singleVolumeMatch[0]);
        searchString = searchString.replace(singleVolumeMatch[0], '');
      }
    }

    // 3. Dọn dẹp nốt các từ khóa phụ nếu còn sót (người dùng gõ mà ko kèm số)
    searchString = searchString.replace(
      /\b(tập|tap|vol|volume|quyển|quyen|cuốn|cuon)\b/gi,
      '',
    );

    return {
      searchString: searchString.replace(/\s+/g, ' ').trim(),
      price,
      volumeNumber,
    };
  }
}

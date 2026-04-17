import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Chỉnh lại đường dẫn nếu cần



// sửa lại một serie có thể thuộc nhiều category rồi 
@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomePageData() {
    // 1. Lấy tất cả danh mục
    const categories = await this.prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    });

    // 2. Lấy các đầu truyện mới nhất, kèm theo thông tin Tập 1 để lấy giá tiền
    const featuredSeries = await this.prisma.series.findMany({
      take: 8, // Lấy 8 truyện mới nhất ra trang chủ
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        volumes: {
          take: 1, // Lấy tập đầu tiên
          orderBy: { title: 'asc' },
        },
      },
    });

    return {
      categories,
      featuredSeries,
    };
  }
  async getSeriesBySlug(slug: string) {
    const series = await this.prisma.series.findUnique({
      where: { slug },
      include: {
        categories: true, // Lấy luôn thông tin danh mục
        volumes: {
          where: { isActive: true }, // Chỉ lấy các tập đang bán
          orderBy: { title: 'asc' }, // Sắp xếp theo tên tập (Tập 1, Tập 2...)
        },
      },
    });

    if (!series) {
      // Nếu khách gõ bậy URL, ném lỗi 404
      const { NotFoundException } = require('@nestjs/common');
      throw new NotFoundException('Không tìm thấy đầu truyện này!');
    }

    return series;
  }
}

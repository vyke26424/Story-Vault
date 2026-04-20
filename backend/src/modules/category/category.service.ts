/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/interface/dtos/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import slugify from 'slugify';
import { generateSlug } from 'src/helper/gen_slug.helper';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    let newSlug = data.slug
      ? slugify(data.slug, {
          lower: true,
          strict: true,
          locale: 'vi',
        })
      : slugify(data.name, {
          lower: true,
          strict: true,
          locale: 'vi',
        });

    const isExists = await this.prisma.category.findUnique({
      where: { slug: newSlug },
    });
    if (isExists) {
      newSlug = generateSlug(newSlug);
    }
    const newCategory = await this.prisma.category.create({
      data: { ...data, slug: newSlug },
    });
    return newCategory;
  }

  // 👉 ĐÃ SỬA: Thêm Logic Phân trang (skip, take) & Tìm kiếm
  async getAllCategory(
    search: string = '',
    pageStr?: string,
    limitStr?: string,
  ) {
    // 1. Tính toán trang & limit
    const page = Math.max(1, Number(pageStr) || 1);
    const limit = Math.max(1, Number(limitStr) || 10);
    const skip = (page - 1) * limit;

    // 2. Tìm theo tên category hoặc slug
    const whereCondition = search
      ? {
          OR: [{ name: { contains: search } }, { slug: { contains: search } }],
        }
      : {};

    // 3. Đếm tổng & Lấy dữ liệu theo phân trang
    const [totalItems, categories] = await Promise.all([
      this.prisma.category.count({ where: whereCondition }),
      this.prisma.category.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: { name: 'asc' }, // Sắp xếp A-Z cho ngay ngắn
      }),
    ]);

    // 4. Trả về đúng format
    return {
      data: categories,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async deleteCategory(categoryId: string) {
    const categoryIsExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { series: true },
        },
      },
    });
    if (!categoryIsExists) {
      throw new NotFoundException('Không tìm thấy Category');
    }
    if (categoryIsExists._count.series > 0) {
      throw new BadRequestException(
        'Category này còn series truyện, hãy di chuyển hoặc xóa chúng trước khi xóa category này!',
      );
    }
    const categoryDeleted = await this.prisma.category.delete({
      where: { id: categoryId },
    });

    return categoryDeleted;
  }

  async updateCategory(categoryId: string, dataUpdate: UpdateCategoryDto) {
    const categoryIsExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryIsExists) {
      throw new NotFoundException('Không tìm thấy category');
    }

    let currentslug: string | undefined;
    if (dataUpdate.slug) {
      currentslug = dataUpdate.slug;
      const isExists = await this.prisma.category.findFirst({
        where: { slug: currentslug, id: { not: categoryId } },
      });
      if (isExists) {
        currentslug = slugify(generateSlug(currentslug));
      }
    }
    return await this.prisma.category.update({
      where: { id: categoryId },
      data: { ...dataUpdate, slug: currentslug },
    });
  }
}

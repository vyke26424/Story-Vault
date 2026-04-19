/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { generateSlug } from 'src/helper/gen_slug.helper';
import {
  CreateSeriesDto,
  UpdateSeriesDto,
} from 'src/interface/dtos/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';

@Injectable()
export class SeriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudService: CloudinaryService,
  ) {}

  // ==========================================
  // CÁC HÀM DÀNH CHO KHÁCH MUA HÀNG (PUBLIC)
  // ==========================================

  async getHomePageData() {
    const categories = await this.prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    });

    const featuredSeries = await this.prisma.series.findMany({
      take: 8,
      where: { isActive: true }, // Chỉ lấy truyện chưa bị xóa
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        volumes: {
          take: 1,
          orderBy: { title: 'asc' },
        },
      },
    });

    return { categories, featuredSeries };
  }

  async getSeriesBySlug(slug: string) {
    const series = await this.prisma.series.findUnique({
      where: { slug, isActive: true },
      include: {
        categories: true,
        volumes: {
          where: { isActive: true },
          orderBy: { volumeNumber: 'asc' },
        },
        reviews: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!series) {
      throw new NotFoundException('Không tìm thấy đầu truyện này!');
    }
    return series;
  }

  async getAllSeriesPublic() {
    return await this.prisma.series.findMany({
      where: { isActive: true }, // Khách chỉ thấy truyện đang bán
      include: { categories: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ==========================================
  // CÁC HÀM DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
  // ==========================================

  async getAllSeriesForAdmin() {
    return await this.prisma.series.findMany({
      include: { categories: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSeriesDeleted() {
    return await this.prisma.series.findMany({
      where: { isActive: false }, // Lấy các truyện đã bị Soft Delete
      include: { categories: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createSeries(data: CreateSeriesDto, file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException(
        'Hiện tại không cho upload mà không có ảnh bìa',
      );

    const cloudUploaded = (await this.cloudService.uploadImage(
      file,
      'story_vault/series',
    )) as { secure_url: string };
    const secureUrl = cloudUploaded.secure_url;

    let currentslug = data.slug
      ? slugify(data.slug, { lower: true, strict: true, locale: 'vi' })
      : slugify(data.title, { lower: true, strict: true, locale: 'vi' });

    const slugIsExists = await this.prisma.series.findUnique({
      where: { slug: currentslug },
    });
    if (slugIsExists) currentslug = generateSlug(currentslug);

    const { categoryIds, ...resData } = data as any;

    const validCategoryIds = categoryIds
      ? Array.isArray(categoryIds)
        ? categoryIds
        : [categoryIds]
      : [];

    try {
      const newSerie = await this.prisma.series.create({
        data: {
          ...resData,
          slug: currentslug,
          coverImage: secureUrl,
          ...(validCategoryIds.length > 0 && {
            categories: {
              connect: validCategoryIds.map((id: string) => ({ id: id })),
            },
          }),
        },
      });
      return newSerie;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Một hoặc nhiều category không tồn tại');
      }
      throw error;
    }
  }

  async updateSeries(
    seriesId: string,
    data: UpdateSeriesDto,
    file?: Express.Multer.File,
  ) {
    let newImageUrl: string | undefined = undefined;
    if (file) {
      const uploadedCloud = (await this.cloudService.uploadImage(
        file,
        'story_vault/series',
      )) as { secure_url: string };
      newImageUrl = uploadedCloud.secure_url;
    }

    let currentslug: string | undefined;
    if (data.slug) {
      currentslug = slugify(data.slug, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      const slugIsExists = await this.prisma.series.findFirst({
        where: { slug: currentslug, id: { not: seriesId } },
      });
      if (slugIsExists) currentslug = generateSlug(currentslug);
    }

    const { categoryIds, ...resData } = data as any;
    const validCategoryIds = categoryIds
      ? Array.isArray(categoryIds)
        ? categoryIds
        : [categoryIds]
      : undefined;

    return await this.prisma.series.update({
      where: { id: seriesId },
      data: {
        ...resData,
        slug: data.slug ? currentslug : undefined,
        ...(newImageUrl ? { coverImage: newImageUrl } : {}),
        ...(validCategoryIds && {
          categories: {
            set: validCategoryIds.map((catId: string) => ({ id: catId })),
          },
        }),
      },
    });
  }

  async deleteSeries(seriesId: string) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
    });
    if (!series) throw new NotFoundException('Không tìm thấy truyện');

    // Soft Delete: Chuyển isActive thành false thay vì xóa hẳn
    return await this.prisma.series.update({
      where: { id: seriesId },
      data: { isActive: false },
    });
  }

  async restoreSeries(seriesId: string) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
    });
    if (!series) throw new NotFoundException('Không tìm thấy truyện');

    // Khôi phục: Chuyển isActive lại thành true
    return await this.prisma.series.update({
      where: { id: seriesId },
      data: { isActive: true },
    });
  }

  async getCatalog(query: any) {
    const {
      type,
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 12,
    } = query;
    const where: any = { isActive: true };

    if (type) where.type = type;
    if (category) {
      where.categories = { some: { slug: category } };
    }
    if (minPrice || maxPrice) {
      where.volumes = {
        some: {
          price: {
            gte: minPrice ? Number(minPrice) : 0,
            lte: maxPrice ? Number(maxPrice) : 99999999,
          },
        },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };
    if (sortBy === 'a-z') orderBy = { title: 'asc' };
    if (sortBy === 'z-a') orderBy = { title: 'desc' };

    const currentPage = Number(page);
    const take = Number(limit);
    const skip = (currentPage - 1) * take;

    // Chạy song song 2 lệnh: 1 lệnh đếm tổng số, 1 lệnh lấy data
    const [totalItems, data] = await Promise.all([
      this.prisma.series.count({ where }),
      this.prisma.series.findMany({
        where,
        include: {
          categories: { select: { name: true, slug: true } },
          volumes: { orderBy: { volumeNumber: 'asc' }, take: 1 },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    // Trả về cả data lẫn metadata để Frontend biết đường vẽ nút
    return {
      data,
      meta: {
        totalItems,
        currentPage,
        totalPages: Math.ceil(totalItems / take),
      },
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllReviewsForAdmin(
    search: string = '',
    pageStr?: string,
    limitStr?: string,
  ) {
    const page = Math.max(1, Number(pageStr) || 1);
    const limit = Math.max(1, Number(limitStr) || 10);
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { comment: { contains: search } },
        { user: { name: { contains: search } } },
        { series: { title: { contains: search } } },
      ];
    }

    const [totalItems, reviews] = await Promise.all([
      this.prisma.review.count({ where: whereCondition }),
      this.prisma.review.findMany({
        where: whereCondition,
        include: {
          user: { select: { name: true, email: true, avatarUrl: true } },
          series: {
            select: {
              title: true,
              coverImage: true,
            },
          },
        },
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: reviews,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Admin xóa review rác
  async deleteReviewByAdmin(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException('Không tìm thấy đánh giá này');

    return this.prisma.review.delete({
      where: { id: reviewId },
    });
  }
}

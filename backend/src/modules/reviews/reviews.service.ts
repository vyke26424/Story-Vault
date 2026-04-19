import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // Lấy toàn bộ Review cho Admin
  async getAllReviewsForAdmin() {
    return this.prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } },
        series: {
          select: {
            title: true,
            coverImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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

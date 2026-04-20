import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  // Khách hàng gửi Feedback
  async createFeedback(data: any, userId?: string) {
    return this.prisma.feedback.create({
      data: {
        userId: userId || null,
        email: data.email,
        type: data.type,
        content: data.content,
      },
    });
  }

  async getAllFeedbacks(
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
        { content: { contains: search } },
        { email: { contains: search } },
        { user: { name: { contains: search } } },
      ];
    }

    // Chạy song song: Đếm tổng số & Lấy dữ liệu
    const [totalItems, feedbacks] = await Promise.all([
      this.prisma.feedback.count({ where: whereCondition }),
      this.prisma.feedback.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
        skip: skip,
        take: limit,
      }),
    ]);

    return {
      data: feedbacks,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Admin đánh dấu đã xử lý
  async resolveFeedback(id: string) {
    return this.prisma.feedback.update({
      where: { id },
      data: { status: 'RESOLVED' },
    });
  }
}

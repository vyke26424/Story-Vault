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

  // Admin xem toàn bộ Feedback
  async getAllFeedbacks() {
    return this.prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  // Admin đánh dấu đã xử lý
  async resolveFeedback(id: string) {
    return this.prisma.feedback.update({
      where: { id },
      data: { status: 'RESOLVED' },
    });
  }
}

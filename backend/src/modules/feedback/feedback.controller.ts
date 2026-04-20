import { Controller, Post, Body, Req, Get, Patch, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Request } from 'express';
import { Public } from 'src/decorator/public/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // API Đón Feedback từ khách (Cho phép Public ai cũng gửi được)
  // 👉 Siết chặt: 1 IP chỉ được gửi 3 feedback trong 1 phút để chống spam
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  async createFeedback(@Body() body: any, @Req() req: Request) {
    // Lấy thông tin user nếu họ đã đăng nhập (được đính kèm qua JWT)
    const user = req['user'] as any;
    const userId = user?.id;

    await this.feedbackService.createFeedback(body, userId);
    return { message: 'Cảm ơn bạn đã góp ý! Chúng tôi sẽ xem xét sớm nhất.' };
  }

  // API cho Admin (Được bảo vệ tự động bởi JwtAuthGuard và RolesGuard)
  @Get()
  async getAllFeedbacks() {
    return { data: await this.feedbackService.getAllFeedbacks() };
  }

  @Patch(':id/resolve')
  async resolveFeedback(@Param('id') id: string) {
    await this.feedbackService.resolveFeedback(id);
    return { message: 'Đã đánh dấu xử lý thành công' };
  }
}

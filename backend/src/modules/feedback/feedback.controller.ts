import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Request } from 'express';
import { Public } from 'src/decorator/public/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // API Đón Feedback từ khách
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  async createFeedback(@Body() body: any, @Req() req: Request) {
    const user = req['user'] as any;
    const userId = user?.id;

    await this.feedbackService.createFeedback(body, userId);
    return { message: 'Cảm ơn bạn đã góp ý! Chúng tôi sẽ xem xét sớm nhất.' };
  }

  @Get()
  async getAllFeedbacks(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.feedbackService.getAllFeedbacks(
      search,
      page,
      limit,
    );
    return {
      message: 'Lấy danh sách Feedback thành công',
      data: result.data,
      meta: result.meta,
    };
  }

  @Patch(':id/resolve')
  async resolveFeedback(@Param('id') id: string) {
    await this.feedbackService.resolveFeedback(id);
    return { message: 'Đã đánh dấu xử lý thành công' };
  }
}

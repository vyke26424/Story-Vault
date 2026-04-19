import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from 'src/prisma/prisma.service'; // Dùng để kiểm tra đơn hàng

@Controller('reviews')
export class ReviewsPublicController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async createReview(@Req() req: any, @Body() dto: any) {
    const userId = req.user?.id;
    if (!userId)
      throw new UnauthorizedException('Bạn phải đăng nhập mới được đánh giá!');

    // ĐÃ FIX THEO LUẬT CHƠI MỚI CỦA SẾP:
    // Kiểm tra xem User này đã TỪNG NHẬN ĐƯỢC HÀNG (DELIVERED) cuốn truyện nào thuộc SERIES này chưa?
    const hasBought = await this.prisma.order.findFirst({
      where: {
        userId: userId,
        status: 'DELIVERED', // Đơn phải giao thành công mới được gáy
        items: {
          some: {
            volume: { seriesId: dto.seriesId },
          },
        },
      },
    });

    if (!hasBought) {
      throw new BadRequestException(
        'Chỉ dành cho khách hàng! Bạn phải mua và nhận thành công ít nhất 1 tập của bộ này mới được phép đánh giá.',
      );
    }

    const newReview = await this.prisma.review.create({
      data: {
        userId: userId,
        seriesId: dto.seriesId,
        rating: dto.rating,
        comment: dto.content,
      },
    });

    return { message: 'Đánh giá thành công', data: newReview };
  }
}

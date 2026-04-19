import { Controller, Get, Delete, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Roles } from 'src/decorator/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/reviews')
export class ReviewsAdminController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.ADMIN)
  @Get()
  async getAllReviews() {
    const data = await this.reviewsService.getAllReviewsForAdmin();
    return { message: 'Lấy danh sách đánh giá thành công', data };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    const data = await this.reviewsService.deleteReviewByAdmin(id);
    return { message: 'Xóa đánh giá thành công', data };
  }
}
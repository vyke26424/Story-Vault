import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsAdminController } from './reviews.admin.controller';
import { ReviewsPublicController } from './reviews.public.controller';


@Module({
  controllers: [ReviewsAdminController, ReviewsPublicController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesPublicController } from './series.public.controller';
import { SeriesAdminController } from './series.admin.controller';

@Module({
  controllers: [SeriesPublicController, SeriesAdminController], // Khai báo cả 2 controller
  providers: [SeriesService],
})
export class SeriesModule {}

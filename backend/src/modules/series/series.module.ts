import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesPublicController } from './series.public.controller';
import { SeriesAdminController } from './series.admin.controller';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],

  controllers: [SeriesPublicController, SeriesAdminController],
  providers: [SeriesService],
})
export class SeriesModule {}

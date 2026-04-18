import { Module } from '@nestjs/common';
import { VolumesService } from './volumes.service';
import { VolumesController } from './volumes.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports : [CloudinaryModule],
  controllers: [VolumesController],
  providers: [VolumesService],
})
export class VolumesModule {}

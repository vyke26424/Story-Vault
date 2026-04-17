import {
  Body,
  Controller,
  Get,
  Post,
  //Put,
  //Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import {
  CreateSeriesDto,
  //UpdateSeriesDto,
} from 'src/interface/dtos/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorator/roles/roles.decorator';
import { Role } from '@prisma/client';
import 'multer';

@Controller('admin/series')
export class SeriesAdminController {
  constructor(private readonly seriesService: SeriesService) {}

  @Roles(Role.ADMIN)
  @Get()
  async getAllSeries() {
    const data = await this.seriesService.getAllSeriesForAdmin();
    return { message: 'Lấy danh sách thành công', data };
  }

  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async postNewSeries(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSeriesDto,
  ) {
    const data = await this.seriesService.createSeries(dto, file);
    return { message: 'Tạo mới serie thành công', data };
  }
}

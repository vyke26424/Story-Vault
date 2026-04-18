/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import {
  CreateSeriesDto,
  UpdateSeriesDto,
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
  @Get('deleted')
  async getSeriesDeleted() {
    const data = await this.seriesService.getSeriesDeleted();
    return { message: 'Lấy danh sách Series đã xóa thành công', data };
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

  @Roles(Role.ADMIN)
  @Patch(':seriesId')
  @UseInterceptors(FileInterceptor('coverImage'))
  async updateSeries(
    @Body() dto: UpdateSeriesDto,
    @Param('seriesId') seriesId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.seriesService.updateSeries(seriesId, dto, file);
    return { message: 'Update Series thành công', data };
  }

  @Roles(Role.ADMIN)
  @Delete(':seriesId')
  async deleteSeries(@Param('seriesId') seriesId: string) {
    const data = await this.seriesService.deleteSeries(seriesId);
    return { message: 'Xóa series thành công (Soft Delete)', data };
  }

  @Roles(Role.ADMIN)
  @Patch('restore/:seriesId')
  async restoreSeries(@Param('seriesId') seriesId: string) {
    const data = await this.seriesService.restoreSeries(seriesId);
    return { message: 'Khôi phục series thành công', data };
  }
}

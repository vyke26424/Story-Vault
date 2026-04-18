// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { SeriesService } from './series.service';
// import {
//   CreateSeriesDto,
//   UpdateSeriesDto,
// } from 'src/interface/dtos/product.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { RolesGuard } from 'src/auth/guard/roles.guard';
// import { Role } from '@prisma/client';
// import { Roles } from 'src/decorator/roles/roles.decorator';
// import { Public } from 'src/decorator/public/public.decorator';

// @Controller('series')
// export class SeriesController {
//   constructor(private readonly seriesService: SeriesService) {}
//   @Roles(Role.ADMIN)
//   @Post()
//   @UseInterceptors(FileInterceptor('coverImage'))
//   async postNewSeries(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() dto: CreateSeriesDto,
//   ) {
//     const data = await this.seriesService.createSeries(dto, file);
//     return {
//       message: 'Tạo mới serie thành công',
//       data,
//     };
//   }

//   @Roles(Role.ADMIN)
//   @Get('/deleted')
//   async getSeriesDeleted() {
//     const data = await this.seriesService.getSeriesDeleted();
//     return {
//       message: 'Lấy danh sách Series đã xóa thành công',
//       data,
//     };
//   }

//   @Roles(Role.ADMIN)
//   @Patch(':seriesId')
//   @UseInterceptors(FileInterceptor('coverImage'))
//   async updateSeries(
//     @Body() dto: UpdateSeriesDto,
//     @Param('seriesId') seriesId: string,
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     const data = await this.seriesService.updateSeries(seriesId, dto, file);
//     return {
//       message: 'Update Series thành công',
//       data,
//     };
//   }
//   @Public()
//   @Get()
//   async getAllSeries() {
//     const data = await this.seriesService.getAllSeries();
//     return {
//       message: 'Lấy toàn bộ dữ liệu thành công',
//       data,
//     };
//   }

//   @Public()
//   @Get(':slug')
//   async getDetailSeries(@Param('slug') slug: string) {
//     const data = await this.seriesService.getOneSeries(slug);
//     return {
//       message: 'Lấy dữ liệu chi tiết của series thành công',
//       data,
//     };
//   }

//   @Roles(Role.ADMIN)
//   @Delete(':seriesId')
//   async deleteSeries(@Param('seriesId') seriesId: string) {
//     const data = await this.seriesService.deleteSeries(seriesId);
//     return {
//       message: 'Xóa series thành công',
//       data,
//     };
//   }

//   @Roles(Role.ADMIN)
//   @Patch('restore/:seriesId')
//   async restoreSeries(@Param('seriesId') seriesId: string) {
//     const data = await this.seriesService.restoreSeries(seriesId);
//     return {
//       message: 'Khôi phục series thành công',
//       data,
//     };
//   }
// }

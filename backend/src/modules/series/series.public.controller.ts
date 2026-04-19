/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { SeriesService } from './series.service';
import { Public } from 'src/decorator/public/public.decorator';

@Controller('series')
export class SeriesPublicController {
  constructor(private readonly seriesService: SeriesService) {}

  @Public()
  @Get('home')
  async getHomeData() {
    return await this.seriesService.getHomePageData();
  }

  @Public()
  @Get()
  async getAllSeries() {
    const data = await this.seriesService.getAllSeriesPublic();
    return { message: 'Lấy danh sách truyện thành công', data };
  }
  @Get('catalog')
  async getCatalog(@Query() query: any) {
    const data = await this.seriesService.getCatalog(query);
    return { message: 'Lấy dữ liệu Catalog thành công', data };
  }
  @Public()
  @Get(':slug')
  async getSeriesDetail(@Param('slug') slug: string) {
    const data = await this.seriesService.getSeriesBySlug(slug);
    return { message: 'Lấy chi tiết truyện thành công', data };
  }
}

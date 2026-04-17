import { Controller, Get, Param } from '@nestjs/common';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesPublicController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get('home')
  async getHomeData() {
    return await this.seriesService.getHomePageData();
  }

  @Get(':slug')
  async getSeriesDetail(@Param('slug') slug: string) {
    return await this.seriesService.getSeriesBySlug(slug);
  }
}

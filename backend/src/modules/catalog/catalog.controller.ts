import { Controller, Get, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('home')
  async getHomeData() {
    return await this.catalogService.getHomePageData();
  }
  @Get('series/:slug')
  async getSeriesDetail(@Param('slug') slug: string) {
    return await this.catalogService.getSeriesBySlug(slug);
  }
}

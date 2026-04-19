import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // Đón API: GET /search/preview?q=...
  @Get('preview')
  async getPreview(@Query('q') q: string) {
    const data = await this.searchService.getPreview(q);
    return {
      message: 'Lấy kết quả xem trước thành công',
      data: data,
    };
  }

  // Đón API: GET /search?q=...&sort=...&type=...
  @Get()
  async getFullSearch(
    @Query('q') q: string,
    @Query('sort') sort: string,
    @Query('type') type: string,
  ) {
    const data = await this.searchService.getFullSearch(q, sort, type);
    return {
      message: 'Tìm kiếm thành công',
      data: data,
      total: data.length,
    };
  }
}

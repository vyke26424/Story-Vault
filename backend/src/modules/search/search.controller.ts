import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/decorator/public/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // Đón API: GET /search/preview?q=...
  @Public()
  @Throttle({ default: { limit: 30, ttl: 10000 } })
  @Get('preview')
  async getPreview(@Query('q') q: string) {
    const data = await this.searchService.getPreview(q);
    return {
      message: 'Lấy kết quả xem trước thành công',
      data: data,
    };
  }

  @Public()
  @Get()
  async getFullSearch(@Query() query: any) {
    const result = await this.searchService.getFullSearch(query);

    // Biến result bây giờ đã là 1 Object chứa cả { data, meta }
    return {
      message: 'Tìm kiếm thành công',
      data: result, // Ném nguyên cục này cho Frontend tự bóc tách
    };
  }
}

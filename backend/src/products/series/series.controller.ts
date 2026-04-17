import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from 'src/interface/dtos/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorator/roles/roles.decorator';

@Controller('series')
export class SeriesController {
    constructor(private readonly seriesService : SeriesService){}
    @Roles(Role.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('coverImage'))
    async postNewSeries(
        @UploadedFile() file : Express.Multer.File,
        @Body() dto : CreateSeriesDto
    ){
        const data = await this.seriesService.createSeries(dto, file);
        return {
            message : 'Tạo mới serie thành công',
            data
        }
    }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { VolumesService } from './volumes.service';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorator/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('volumes')
export class VolumesController {
  constructor(private readonly volumesService: VolumesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(
    @Body() createVolumeDto: CreateVolumeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.volumesService.createVolume(createVolumeDto, file);
    return {
      message: 'Tạo mới volume thành công',
      data,
    };
  }

  // 👉 ĐÃ SỬA: Bổ sung đón page và limit
  @Roles(Role.ADMIN)
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.volumesService.getAllVolumes(
      search,
      isActive,
      page,
      limit,
    );
    // Trả về đúng form { data, meta } cho Frontend phân trang
    return {
      message: 'Tìm kiếm danh sách volume thành công',
      data: result.data,
      meta: result.meta,
    };
  }

  @Roles(Role.ADMIN)
  @Patch('restore/:volumeId')
  async restoreVolume(@Param('volumeId') volumeId: string) {
    const data = await this.volumesService.restoreVolume(volumeId);
    return {
      message: 'Khôi phục volume thành công',
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Get('transactions')
  async getInventoryTransactions(
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.volumesService.getInventoryTransactions(
      search,
      type,
      page,
      limit,
    );
    return {
      message: 'Lấy lịch sử giao dịch kho thành công',
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':volumeId')
  async findOne(@Param('volumeId') volumeId: string) {
    const data = await this.volumesService.getVolumeById(volumeId);
    return {
      message: 'Lấy thông tin chi tiết volume thành công',
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Patch(':volumeId')
  @UseInterceptors(FileInterceptor('coverImage'))
  async update(
    @Param('volumeId') volumeId: string,
    @Body() updateVolumeDto: UpdateVolumeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.volumesService.updateVolume(
      volumeId,
      updateVolumeDto,
      file,
    );
    return {
      message: 'Cập nhật volume thành công',
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Delete(':volumeId')
  async remove(@Param('volumeId') volumeId: string) {
    const data = await this.volumesService.removeVolume(volumeId);
    return {
      message: 'Xóa volume thành công',
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Post('bulk-import')
  async bulkImportStock(
    @Body()
    body: {
      items: { volumeId: string; quantity: number; note?: string }[];
    },
  ) {
    const data = await this.volumesService.bulkImportStock(body.items);
    return {
      message: `Đã nhập kho thành công cho ${data} đầu sách!`,
      data,
    };
  }
}

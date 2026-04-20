import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class VolumesService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryService,
  ) {}
  async createVolume(dto: CreateVolumeDto, file?: Express.Multer.File) {
    let imageUrl = undefined;
    try {
      if (file) {
        const cloudData = await this.cloudService.uploadImage(
          file,
          'story_vault/volumes',
        );
        imageUrl = cloudData.secure_url;
      }
      const newDataCreated = await this.prisma.volume.create({
        data: {
          ...dto,
          ...(imageUrl
            ? {
                coverImage: imageUrl,
              }
            : {}),
        },
      });
      return newDataCreated;
    } catch (error) {
      throw error;
    }
  }

  // 👉 ĐÃ SỬA: Xử lý phân trang chuẩn (skip, take, count)
  async getAllVolumes(
    searchKeyword?: string,
    activeStatus?: string,
    page: string = '1',
    limit: string = '10',
  ) {
    const whereCondition: any = {};

    if (activeStatus === 'true') {
      whereCondition.isActive = true;
    } else if (activeStatus === 'false') {
      whereCondition.isActive = false;
    }

    if (searchKeyword) {
      whereCondition.OR = [
        { title: { contains: searchKeyword } },
        { isbn: { contains: searchKeyword } },
        { series: { title: { contains: searchKeyword } } },
      ];
    }

    // Tính toán phân trang
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Chạy song song 2 lệnh: Lấy dữ liệu VÀ Đếm tổng số để tăng tốc
    const [data, totalItems] = await Promise.all([
      this.prisma.volume.findMany({
        where: whereCondition,
        skip: skip,
        take: limitNumber,
        include: {
          series: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.volume.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(totalItems / limitNumber);

    // Trả về cả dữ liệu lẫn thông tin trang (meta)
    return {
      data,
      meta: {
        currentPage: pageNumber,
        totalPages,
        totalItems,
        limit: limitNumber,
      },
    };
  }

  async getVolumeById(volumeId: string) {
    const volume = await this.prisma.volume.findUnique({
      where: { id: volumeId },
      include: { series: true },
    });
    if (!volume) throw new NotFoundException('Không tìm thấy tập truyện này!');
    return volume;
  }

  async updateVolume(
    volumeId: string,
    updateVolumeDto: UpdateVolumeDto,
    file?: Express.Multer.File,
  ) {
    try {
      let imageUrl: string | undefined = undefined;
      if (file) {
        const cloudData = await this.cloudService.uploadImage(
          file,
          'story_vault/volumes',
        );
        imageUrl = cloudData.secure_url;
      }
      const volumeUpdated = await this.prisma.volume.update({
        where: { id: volumeId },
        data: {
          ...updateVolumeDto,
          ...(imageUrl ? { coverImage: imageUrl } : {}),
        },
      });
      return volumeUpdated;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Volume không tồn tại');
      }
      throw error;
    }
  }

  async removeVolume(volumeId: string) {
    try {
      return await this.prisma.volume.update({
        where: { id: volumeId },
        data: { isActive: false },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Không tìm thấy Volume cần xóa!');
      }
      throw error;
    }
  }

  async restoreVolume(volumeId: string) {
    try {
      const dataRestore = await this.prisma.volume.update({
        where: { id: volumeId },
        data: { isActive: true },
      });

      return dataRestore;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Không tìm thấy volume để restore!');
      }
      throw error;
    }
  }

  async bulkImportStock(
    items: { volumeId: string; quantity: number; note?: string }[],
  ) {
    return await this.prisma.$transaction(async (tx) => {
      let importedCount = 0;

      for (const item of items) {
        const volume = await tx.volume.findUnique({
          where: { id: item.volumeId },
        });
        if (!volume) continue;

        await tx.volume.update({
          where: { id: item.volumeId },
          data: { stock: { increment: item.quantity } },
        });

        await tx.inventoryTransaction.create({
          data: {
            volumeId: item.volumeId,
            type: 'IMPORT',
            quantity: item.quantity,
            note: item.note || 'Nhập kho hàng loạt bằng Excel',
          },
        });

        importedCount++;
      }
      return importedCount;
    });
  }
}

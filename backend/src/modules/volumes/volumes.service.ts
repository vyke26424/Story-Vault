/* eslint-disable no-useless-catch */
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
        { id: { contains: searchKeyword } },
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
      const errors: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.quantity <= 0) {
          errors.push(
            `- Dòng ${i + 1}: Số lượng nhập phải lớn hơn 0 (ID: ${item.volumeId})`,
          );
          continue;
        }

        const volume = await tx.volume.findUnique({
          where: { id: item.volumeId },
        });
        if (!volume) {
          errors.push(
            `- Dòng ${i + 1}: Không tìm thấy sách với ID ${item.volumeId}`,
          );
          continue;
        }

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

      // Nếu có bất kì lỗi nào, ném Exception để Rollback giao dịch
      if (errors.length > 0) {
        throw new BadRequestException(
          'Vui lòng kiểm tra lại file Excel:\n' + errors.join('\n'),
        );
      }

      return importedCount;
    });
  }
  async getInventoryTransactions(
    searchKeyword?: string,
    type?: string,
    page: string = '1',
    limit: string = '10',
  ) {
    const whereCondition: any = {};

    // Lọc theo loại hình: IMPORT, EXPORT, ADJUST
    if (type && type !== 'ALL') {
      whereCondition.type = type;
    }

    // Tìm theo mã sách, ghi chú, hoặc tên sách
    if (searchKeyword) {
      whereCondition.OR = [
        { volumeId: { contains: searchKeyword } },
        { note: { contains: searchKeyword } },
        { volume: { title: { contains: searchKeyword } } },
        { volume: { series: { title: { contains: searchKeyword } } } },
      ];
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);
    const skip = (pageNumber - 1) * limitNumber;

    const [data, totalItems] = await Promise.all([
      this.prisma.inventoryTransaction.findMany({
        where: whereCondition,
        skip: skip,
        take: limitNumber,
        include: {
          volume: {
            include: { series: true }, // Lấy thông tin sách và truyện để FE hiển thị
          },
        },
        orderBy: { createdAt: 'desc' }, // Mới nhất lên đầu
      }),
      this.prisma.inventoryTransaction.count({ where: whereCondition }),
    ]);

    return {
      data,
      meta: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
        totalItems,
        limit: limitNumber,
      },
    };
  }
}

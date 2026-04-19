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
    cursorId?: string,
    searchKeyword?: string,
    activeStatus?: string,
  ) {
    const whereCondition: any = {};

    if (activeStatus === 'true') {
      whereCondition.isActive = true;
    } else if (activeStatus === 'false') {
      whereCondition.isActive = false;
    } else {
    }

    if (searchKeyword) {
      whereCondition.OR = [
        { title: { contains: searchKeyword } },
        { isbn: { contains: searchKeyword } },
        { series: { title: { contains: searchKeyword } } },
      ];
    }

    const data = await this.prisma.volume.findMany({
      where: whereCondition,
      take: 20,
      ...(cursorId && {
        skip: 1,
        cursor: { id: cursorId },
      }),
      include: {
        series: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return data;
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
}

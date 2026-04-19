import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangePasswordDto,
  UpdateProfileDto,
} from 'src/interface/dtos/user.dto';
import * as argon2 from 'argon2';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
      },
    });

    // Xóa mật khẩu trước khi trả về cho client
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    // BƯỚC 1: Lấy user từ DB để có mật khẩu đã hash
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }

    // BƯỚC 2: So sánh mật khẩu cũ người dùng nhập với hash trong DB
    const isPasswordMatching = await argon2.verify(
      user.password, // user.password là chuỗi hash lấy từ DB
      dto.oldPassword,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng.');
    }

    // BƯỚC 3: Hash mật khẩu mới và cập nhật vào DB
    const newHashedPassword = await argon2.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
  }
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const uploaded = await this.cloudinary.uploadAvatar(file);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: uploaded.secure_url }, // 👉 Khớp với schema avatarUrl
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
      },
    });

    return user;
  }
}

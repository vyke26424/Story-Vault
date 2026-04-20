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
      data: { avatarUrl: uploaded.secure_url }, 
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

  // ==========================================
  // CÁC HÀM DÀNH CHO ADMIN
  // ==========================================

  async getAllUsersForAdmin(
    search: string = '',
    roleFilter?: string,
    pageStr?: string,
    limitStr?: string,
  ) {
    const page = Math.max(1, Number(pageStr) || 1);
    const limit = Math.max(1, Number(limitStr) || 10);
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    // Tìm kiếm theo Tên hoặc Email
    if (search) {
      whereCondition.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    // Lọc theo Role (Nếu có và không phải là 'ALL')
    if (roleFilter && roleFilter !== 'ALL') {
      whereCondition.role = roleFilter;
    }

    // Chạy song song đếm tổng số và lấy data
    const [totalItems, users] = await Promise.all([
      this.prisma.user.count({ where: whereCondition }),
      this.prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          _count: {
            select: { orders: true }, // Đếm số đơn hàng khách đã mua
          },
        },
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: users,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async updateUserRole(userId: string, role: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng này');

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}

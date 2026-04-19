import { Controller, Get, Req, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    const user = req.user;

    // Kiểm tra đăng nhập
    if (!user) {
      throw new UnauthorizedException('Yêu cầu đăng nhập!');
    }

    // Kiểm tra quyền Admin (Cực kỳ quan trọng để bảo mật số liệu)
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Chỉ Admin mới có quyền vào đây nha sếp!');
    }

    const stats = await this.adminService.getDashboardStats();
    
    return {
      message: 'Lấy dữ liệu Dashboard thành công',
      data: stats,
    };
  }
}
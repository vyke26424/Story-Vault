import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/decorator/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/user')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers() {
    const data = await this.userService.getAllUsersForAdmin();
    return { message: 'Lấy danh sách người dùng thành công', data };
  }

  @Roles(Role.ADMIN)
  @Patch(':id/role')
  async changeRole(@Param('id') id: string, @Body('role') role: Role) {
    const data = await this.userService.updateUserRole(id, role);
    return { message: 'Cập nhật phân quyền thành công', data };
  }
}

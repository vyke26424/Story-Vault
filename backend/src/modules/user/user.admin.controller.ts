import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/decorator/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/user')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.userService.getAllUsersForAdmin(
      search,
      role,
      page,
      limit,
    );
    return {
      message: 'Lấy danh sách người dùng thành công',
      data: result.data,
      meta: result.meta,
    };
  }

  @Roles(Role.ADMIN)
  @Patch(':id/role')
  async changeRole(@Param('id') id: string, @Body('role') role: Role) {
    const data = await this.userService.updateUserRole(id, role);
    return { message: 'Cập nhật phân quyền thành công', data };
  }
}

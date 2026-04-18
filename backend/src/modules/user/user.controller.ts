import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  UpdateProfileDto,
} from 'src/interface/dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Yêu cầu đăng nhập');

    const updatedUser = await this.userService.updateProfile(userId, dto);
    return {
      message: 'Cập nhật thông tin thành công!',
      data: updatedUser,
    };
  }

  @Put('change-password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Yêu cầu đăng nhập');

    await this.userService.changePassword(userId, dto);

    return {
      message: 'Đổi mật khẩu thành công!',
    };
  }
}

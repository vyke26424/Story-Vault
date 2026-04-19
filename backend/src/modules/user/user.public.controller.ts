import {
  Controller,
  Put,
  Post,
  Body,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  UpdateProfileDto,
} from 'src/interface/dtos/user.dto';

@Controller('user')
export class UserPublicController {
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
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Yêu cầu đăng nhập');
    if (!file) throw new BadRequestException('Vui lòng chọn một tệp ảnh');

    const updatedUser = await this.userService.uploadAvatar(userId, file);

    return {
      message: 'Cập nhật ảnh đại diện thành công!',
      data: updatedUser,
    };
  }
}

import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Register, SignIn } from 'src/interface/dtos/auth.dto';
import { Response, Request } from 'express';
import { Public } from 'src/decorator/public/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: Register,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {

    const device = (req.headers['user-agent'] as string) || 'unknown';
    const data = await this.authService.register(dto, device);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // Môi trường dev (localhost) thì secure = false
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: data.accessToken, user: data.user };
  }

  @Public()
  @Post('signin')
  async signIn(
    @Body() dto: SignIn,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const device = (req.headers['user-agent'] as string) || 'unknown';
    const data = await this.authService.signIn(dto, device);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: data.accessToken, user: data.user };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    // Fix: Luôn clear cookie trước để đảm bảo khách văng ra khỏi phiên an toàn
    res.clearCookie('refreshToken');
    await this.authService.logOut(refreshToken);

    return { message: 'Đăng xuất thành công' };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    const device = (req.headers['user-agent'] as string) || 'unknown';

    const data = await this.authService.refresh(refreshToken, device);

    res.cookie('refreshToken', data.newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: data.accessToken };
  }
}

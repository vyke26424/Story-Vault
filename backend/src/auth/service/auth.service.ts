import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Register, SignIn } from 'src/interface/dtos/auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import ms, { StringValue } from 'ms';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: Register, device: string) {
    const isExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (isExists) {
      throw new BadRequestException(
        'Email đã tồn tại, hãy dùng một email khác',
      );
    }

    const hashedPassword = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await this.generateToken(
      user.id,
      user.role,
      device,
    );
    const { password, ...infoUser } = user;

    return { accessToken, refreshToken, user: infoUser };
  }

  async signIn(data: SignIn, device: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }

    const isMatch = await argon2.verify(user.password, data.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }

    const { accessToken, refreshToken } = await this.generateToken(
      user.id,
      user.role,
      device,
    );
    const { password, ...userWithoutPass } = user;

    return { accessToken, refreshToken, user: userWithoutPass };
  }

  async logOut(refreshToken: string) {
    if (!refreshToken) return; // Nếu ko có token thì thôi, client vẫn tự xóa cookie

    try {
      // Dùng decode thay vì verify để lấy jti (kể cả khi token vừa hết hạn)
      const payload = this.jwtService.decode(refreshToken) as { jti: string };
      if (payload && payload.jti) {
        // Thử xóa trong DB, lỗi (do đã bị xóa trước đó) thì bỏ qua
        await this.prisma.refreshToken
          .delete({
            where: { id: payload.jti },
          })
          .catch(() => {});
      }
    } catch (error) {
      // Bỏ qua lỗi để tiến trình đăng xuất của user không bị kẹt
      console.error('Lỗi khi logout:', error);
    }
  }

  async refresh(refreshToken: string, device: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Không tìm thấy refresh-token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.jwt_refresh,
      });

      const isExists = await this.prisma.refreshToken.findUnique({
        where: { id: payload.jti },
      });

      if (!isExists) {
        throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
      }

      // FIX: Xóa refresh token cũ đi để tránh rác Database
      await this.prisma.refreshToken.delete({
        where: { id: payload.jti },
      });

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateToken(payload.userId, payload.role, device);

      return { accessToken, newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Phiên đăng nhập đã hết hạn hoặc không hợp lệ',
      );
    }
  }

  async generateToken(userId: string, role: string, device: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, role: role },
      { expiresIn: this.config.jwt_secret_expires as StringValue },
    );

    const jti = crypto.randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      { userId, role, jti },
      {
        expiresIn: this.config.jwt_refresh_expires as StringValue,
        secret: this.config.jwt_refresh,
      },
    );

    await this.prisma.refreshToken.create({
      data: {
        id: jti,
        userId: userId,
        device: device,
        expiresAt: new Date(
          Date.now() + ms(this.config.jwt_refresh_expires as StringValue),
        ),
      },
    });

    return { accessToken, refreshToken };
  }
}

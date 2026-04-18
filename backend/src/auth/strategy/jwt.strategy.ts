import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt_secret,
    });
  }

  // FIX TẠI ĐÂY: Nhận payload (ruột token) và gom đúng chuẩn trả về cho các Controller xài
  async validate(payload: any) {
    return {
      // Móc ID ra (bao lô tất cả các tên sếp có thể đặt ở AuthService)
      id: payload.id || payload.sub || payload.userId,
      role: payload.role,
    };
  }
}

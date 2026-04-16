import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  jwt_secret: process.env.jwt_secret,
  jwt_secret_expires: process.env.jwt_secret_expires || ('15m' as const),
  jwt_refresh: process.env.jwt_refresh,
  jwt_refresh_expires: process.env.jwt_refresh_expires || ('7d' as const),
}));

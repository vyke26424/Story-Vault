import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth/auth.module';
import jwtConfig from './config/jwt.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true, load : [jwtConfig]
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

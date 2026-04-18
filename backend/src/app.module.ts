import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';


import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';



import cloudinaryConfig from './config/cloudinary.config';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './auth/module/auth.module';
import { SeriesModule } from './modules/series/series.module';
import { OrderModule } from './modules/order/order.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module'; 
import { UserModule } from './modules/user/user.module';
import { VolumesModule } from './modules/volumes/volumes.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, cloudinaryConfig],
    }),
    PrismaModule,
    AuthModule,
    SeriesModule,
    CloudinaryModule,
    OrderModule,
    UserModule,
    VolumesModule,
  ],
  controllers: [
    AppController,
    // ĐÃ XÓA SeriesController ở đây vì nó được quản lý bên trong SeriesModule rồi
  ],
  providers: [
    AppService,
    // --- Lính gác toàn cục (Global Guards) ---
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // ĐÃ XÓA SeriesService ở đây vì nó được quản lý bên trong SeriesModule rồi
  ],
})
export class AppModule {}

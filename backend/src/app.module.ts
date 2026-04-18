import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Guards & Configs
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';
import jwtConfig from './config/jwt.config';
import cloudinaryConfig from './config/cloudinary.config';

// Feature Modules
import { AuthModule } from './auth/module/auth.module';
import { SeriesModule } from './modules/series/series.module';
import { OrderModule } from './modules/order/order.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module'; // Đường dẫn Cloudinary chuẩn
import { VolumesModule } from './products/volumes/volumes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, cloudinaryConfig],
    }),
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    SeriesModule,
    OrderModule,
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

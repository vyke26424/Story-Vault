/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';
import { CatalogModule } from './modules/series/series.module';
import jwtConfig from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';
import { SeriesService } from './modules/series/series.service';
import { CategoryService } from './modules/categories/category.service';
import { CategoryController } from './modules/categories/category.controller';
import { SeriesController } from './modules/series/series.admin.controller';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { OrderModule } from './modules/order/order.module';
import cloudinaryConfig from './config/cloudinary.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, cloudinaryConfig],
    }),
    PrismaModule,
    AuthModule,
    CatalogModule,
    CloudinaryModule,
    OrderModule,
  ],
  controllers: [AppController, CategoryController, SeriesController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    SeriesService,
    CategoryService,
  ],
})
export class AppModule {}

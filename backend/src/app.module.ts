/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';
//import { CatalogModule } from './modules/series/series.module';
import jwtConfig from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';
import { SeriesService } from './products/series/series.service';
//import { CategoryService } from './products/categories/category.service';
//import { CategoryController } from './products/categories/category.controller';
import { SeriesController } from './products/series/series.controller';
//import { CloudinaryService } from './upload/cloudinary/cloudinary.service';
//import { CloudinaryModule } from './upload/cloudinary/cloudinary.module';
import { VolumesModule } from './products/volumes/volumes.module';
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
   // CatalogModule,
   // CloudinaryModule,
    OrderModule,
    VolumesModule,
  ],
  controllers: [AppController,  SeriesController],
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
  
  ],
})
export class AppModule {}

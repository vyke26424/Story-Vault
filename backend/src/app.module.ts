import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';

import { OrderModule } from './modules/order/order.module';
import cloudinaryConfig from './config/cloudinary.config';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './auth/module/auth.module';
import { VolumesModule } from './modules/volumes/volumes.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { SeriesModule } from './modules/series/series.module';
import { UserModule } from './modules/user/user.module';
import { SearchModule } from './modules/search/search.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

import { AdminModule } from './modules/admin/admin.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, cloudinaryConfig],
    }),
    PrismaModule,
    AuthModule,
    AdminModule,
    CategoryModule,
    SeriesModule,
    CloudinaryModule,
    OrderModule,
    UserModule,
    ReviewsModule,
    SearchModule,
    VolumesModule,
  ],
  controllers: [AppController],
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
  ],
})
export class AppModule {}

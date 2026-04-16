import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import jwtConfig from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';
import { ProductService } from './products/series/series.service';
import { CategoryService } from './products/categories/category.service';
import { CategoryController } from './products/categories/category.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, load: [jwtConfig]
    }),
    PrismaModule,
    AuthModule,
    CatalogModule,
  ],
  controllers: [AppController, CategoryController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    ProductService,
    CategoryService
  ],
})
export class AppModule { }

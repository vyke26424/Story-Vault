import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Module({
  imports: [CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}

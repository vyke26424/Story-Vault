import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPublicController } from './user.public.controller';
import { UserAdminController } from './user.admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [UserPublicController, UserAdminController],
  providers: [UserService, PrismaService],
})
export class UserModule {}

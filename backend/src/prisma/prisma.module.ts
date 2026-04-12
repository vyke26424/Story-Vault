import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ← Đánh dấu Global để mọi module đều dùng được mà không cần import
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

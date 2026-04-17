import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderPublicController } from './order.public.controller';
import { OrderAdminController } from './order.admin.controller';

@Module({
  providers: [OrderService],
  controllers: [OrderPublicController, OrderAdminController],
})
export class OrderModule {}

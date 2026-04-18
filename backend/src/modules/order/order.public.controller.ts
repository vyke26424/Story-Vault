/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from 'src/interface/dtos/order.dto';

@Controller('order')
export class OrderPublicController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    // Bao lô tất cả các trường hợp tên biến giải mã từ JWT Token
    const userId = req.user?.id || req.user?.sub || req.user?.userId;

    if (!userId) {
      // throw new UnauthorizedException(
      //   'Token hợp lệ nhưng không tìm thấy ID người dùng bên trong!',
      // );
      throw new UnauthorizedException(
        'Ruột của Token hiện tại là: ' + JSON.stringify(req.user),
      );
    }

    const order = await this.orderService.createOrder(userId, dto);

    return {
      message: 'Đặt hàng thành công!',
      data: order,
    };
  }
}

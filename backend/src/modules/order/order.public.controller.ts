/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from 'src/interface/dtos/order.dto';
// Thêm AuthGuard ở đây nếu bạn đã cấu hình JWT bảo vệ route

@Controller('order')
export class OrderPublicController {
  constructor(private readonly orderService: OrderService) {}

  // @UseGuards(JwtAuthGuard) // Bật cái này lên nếu bắt buộc đăng nhập
  @Post()
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    // Lưu ý: Tạm thời lấy userId cứng để test, nếu dùng JwtAuthGuard thì lấy req.user.id
    const userId =
      req.user?.id || 'Thay_bang_ID_cua_1_User_trong_Database_de_test';

    const order = await this.orderService.createOrder(userId, dto);

    return {
      message: 'Đặt hàng thành công!',
      data: order,
    };
  }
}

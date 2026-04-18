/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from 'src/interface/dtos/order.dto';

@Controller('order')
export class OrderPublicController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException(
        'Token hợp lệ nhưng không tìm thấy ID người dùng bên trong!',
      );
    }

    const order = await this.orderService.createOrder(userId, dto);

    return {
      message: 'Đặt hàng thành công!',
      data: order,
    };
  }

  @Get()
  async getMyOrders(@Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Yêu cầu đăng nhập để xem đơn hàng!');
    }

    const orders = await this.orderService.getMyOrders(userId);

    return {
      message: 'Lấy lịch sử đơn hàng thành công!',
      data: orders, // Trả về biến data để Frontend hứng
    };
  }

  // LƯU Ý: Endpoint có path tĩnh ('stats') phải được đặt TRƯỚC endpoint có path động (':id')
  // để NestJS không hiểu nhầm 'stats' là một giá trị của 'id'
  @Get('stats')
  async getOrderStats(@Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Yêu cầu đăng nhập!');
    }

    const stats = await this.orderService.getOrderStats(userId);

    return {
      message: 'Lấy thống kê đơn hàng thành công!',
      data: stats,
    };
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string, @Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Yêu cầu đăng nhập!');
    }

    const order = await this.orderService.getOrderById(orderId, userId);

    return {
      message: 'Lấy chi tiết đơn hàng thành công!',
      data: order,
    };
  }
}

import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/decorator/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/orders')
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.ADMIN)
  @Get()
  async getAllOrders() {
    const data = await this.orderService.getAllOrdersForAdmin();
    return {
      message: 'Lấy toàn bộ danh sách đơn hàng thành công',
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const data = await this.orderService.updateOrderStatusByAdmin(id, status);
    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data,
    };
  }
}

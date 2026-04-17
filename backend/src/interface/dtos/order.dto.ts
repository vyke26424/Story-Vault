import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Method } from '@prisma/client';

export class OrderItemDto {
  @IsString() @IsNotEmpty() volumeId!: string;
  @IsNumber() @IsNotEmpty() quantity!: number;
  @IsNumber() @IsNotEmpty() price!: number;
}

export class CreateOrderDto {
  // Thông tin giao hàng
  @IsString() @IsNotEmpty() phone!: string;
  @IsString() @IsNotEmpty() street!: string;
  @IsString() @IsNotEmpty() ward!: string;
  @IsString() @IsNotEmpty() district!: string;
  @IsString() @IsNotEmpty() city!: string;

  // Tổng kết tiền
  @IsNumber() @IsNotEmpty() totalAmount!: number;
  @IsNumber() @IsNotEmpty() shippingFee!: number;
  @IsNumber() @IsNotEmpty() finalAmount!: number;

  @IsOptional() @IsString() note?: string;

  // Thanh toán
  @IsEnum(Method) @IsNotEmpty() paymentMethod!: Method;

  // Danh sách các cuốn sách mua
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

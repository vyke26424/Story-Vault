import { PartialType } from '@nestjs/mapped-types';
import { Type as TypeEnum, Status as StatusEnum } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
// 👉 IMPORT THÊM 2 ÔNG NÀY ĐỂ ÉP KIỂU DỮ LIỆU TỪ FORMDATA
import { Transform, Type } from 'class-transformer';

// ==========================================
// SERIES DTO
// ==========================================
export class CreateSeriesDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên truyện không được để trống' })
  title!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsEnum(TypeEnum, { message: 'Kiểu truyện không hợp lệ' })
  @IsNotEmpty()
  type!: TypeEnum;

  @IsEnum(StatusEnum, { message: 'Trạng thái truyện không hợp lệ' })
  @IsNotEmpty()
  status!: StatusEnum;

  // 👉 ĐÃ FIX: Ép chuỗi "10" (từ FormData) thành số 10
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  totalVolumes?: number;

  // 👉 ĐÃ FIX: Ép chuỗi "true"/"false" (từ FormData) thành boolean thật
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // 👉 LƯU Ý: Tạm thời để Optional vì Frontend sếp chưa làm chức năng chọn Thể loại
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {}

// ==========================================
// CATEGORY DTO
// ==========================================
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

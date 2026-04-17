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
  IsNumber,
  IsDateString,
} from 'class-validator';

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

  @IsInt()
  @Min(0)
  @IsOptional()
  totalVolumes?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'Truyện phải có ít nhất 1 thể loại' })
  categoryIds!: string[];
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


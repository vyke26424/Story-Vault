import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateVolumeDto {
  @IsNotEmpty({ message: 'Bắt buộc phải có ID của bộ truyện (seriesId)' })
  @IsString()
  seriesId: string;

  @IsNotEmpty({ message: 'Bạn chưa nhập số thứ tự tập truyện (volumeNumber)' })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Số tập phải thấp nhất là 1' })
  volumeNumber: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Giá bán phải là một con số' })
  @Min(0, { message: 'Giá bán không được là số âm' })
  price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Giá gốc phải là một con số' })
  @Min(0)
  @IsOptional()
  originalPrice?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0, { message: 'Tồn kho ít nhất là 0' })
  stock: number;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsDateString(
    {},
    { message: 'Ngày xuất bản không đúng định dạng ISO (YYYY-MM-DD)' },
  )
  @IsOptional()
  publishDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

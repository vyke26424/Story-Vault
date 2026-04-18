import { Type } from 'class-transformer'; // Import cái này để ép kiểu
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

    @IsNotEmpty({ message: 'Bắt buộc phải có ID của bộ truyện' })
    @IsString()
    seriesId: string; 

    @IsNotEmpty()
    @Type(() => Number) 
    @IsNumber()
    volumeNumber: number;

    @IsString()
    title: string; 

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
    @Min(0)
    stock: number;

    @IsString()
    @IsOptional()
    isbn?: string; 

    @IsDateString({}, { message: 'Ngày xuất bản không đúng định dạng thời gian' })
    @IsOptional()
    publishDate?: string; 

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

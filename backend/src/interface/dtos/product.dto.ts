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
    Min 
} from "class-validator";

export class CreateSeriesDto {
    @IsString()
    @IsNotEmpty({ message: 'Tên truyện không được để trống' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Đường dẫn (slug) không được để trống' })
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsEnum(TypeEnum, { message: 'Kiểu truyện không hợp lệ' })
    @IsNotEmpty()
    type: TypeEnum;

    @IsEnum(StatusEnum, { message: 'Trạng thái truyện không hợp lệ' })
    @IsNotEmpty()
    status: StatusEnum;

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
    categoryIds: string[]; 
}

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {

}


export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Đường dẫn (slug) không được để trống' })
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

import { IsNumber, IsDateString } from 'class-validator';

export class CreateVolumeDto {

    @IsString()
    @IsOptional()
    title?: string; 

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsNumber({}, { message: 'Giá bán phải là một con số' })
    @Min(0, { message: 'Giá bán không được là số âm' })
    price: number;

    @IsNumber({}, { message: 'Giá gốc phải là một con số' })
    @Min(0)
    @IsOptional()
    originalPrice?: number;

    @IsInt()
    @Min(0)
    stock: number;

    @IsString()
    @IsOptional()
    isbn?: string; // Mã số tiêu chuẩn quốc tế cho sách

    @IsDateString({}, { message: 'Ngày xuất bản không đúng định dạng thời gian' })
    @IsOptional()
    publishDate?: string; 

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateVolumeDto extends PartialType(CreateVolumeDto) {}



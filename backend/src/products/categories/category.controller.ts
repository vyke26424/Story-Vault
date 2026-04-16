import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/interface/dtos/product.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly cateService : CategoryService){}
    
    @Post()
    async createCategory(
        @Body() dto : CreateCategoryDto
    ){
        const data  = await this.cateService.createCategory(dto);
        return {
            message : 'Tạo category mới thành công',
            data : data
        }
    }

    @Get()
    async getAllCategory () {
        const data = await this.cateService.getAllCategory();
        return {
            message : 'Lấy toàn bộ category thành công',
            data : data
        }
    }

    @Delete(':categoryId')
    async deleteCategory (
        @Param('categoryId') categoryId : string
    ){
        const data = await this.cateService.deleteCategory(categoryId);
        return {
            message : 'Xóa category thành công',
            data 
        }
    }

    @Patch(':categoryId')
    async updateCategory(
        @Param('categoryId') categoryId : string,
        @Body() dto : UpdateCategoryDto
    ) {
        const data = await this.cateService.updateCategory(categoryId, dto);
        return {
            message : 'Update category thành công',
            data
        }
    }
}

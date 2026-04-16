import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/interface/dtos/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import slugify from 'slugify';


@Injectable()
export class CategoryService {
    constructor(private readonly prisma : PrismaService){}

    async createCategory(data : CreateCategoryDto){
        let newSlug = data.slug ? data.slug :  slugify(
            data.name, {
                lower : true,
                strict : true,
                locale : 'vi'
            }
        ) ;

        const isExists = await this.prisma.category.findUnique({
            where : {slug : newSlug}
        });
        if(isExists) {
            newSlug = this.generateSlug(newSlug);
        }
        const newCategory = await this.prisma.category.create({
            data : {...data, slug : newSlug}
        });
        return newCategory;
    }

    async getAllCategory() {
        const allCategory = await this.prisma.category.findMany();
        return allCategory ;
    }

    async deleteCategory (categoryId : string) {
        const categoryIsExists = await this.prisma.category.findUnique({
            where : {id : categoryId},
            include : {
                _count : {
                    select : {series : true}
                }
            }
        });
        if(!categoryIsExists) {
            throw new NotFoundException('Không tìm thấy Category');
        }
        if(categoryIsExists._count.series > 0) {
            throw new BadRequestException('Category này còn series truyện, hãy di chuyển hoặc xóa chúng trước khi xóa category này!');
        }
        const categoryDeleted = await this.prisma.category.delete(
            {where : {id : categoryId}}
        );

        return categoryDeleted ;

    }

    async updateCategory (categoryId : string, dataUpdate : UpdateCategoryDto) {
        const categoryIsExists = await this.prisma.category.findUnique({
            where : {id : categoryId}
        });

        if(!categoryIsExists) {
            throw new NotFoundException('Không tìm thấy category');
        }

        let  currentslug : string | undefined ;
        if(dataUpdate.slug) {
            currentslug = dataUpdate.slug;
            const isExists = await this.prisma.category.findFirst({
                where : {slug : currentslug, id : {not : categoryId} },
                
            });
            if(isExists) {
                currentslug = this.generateSlug(currentslug);
            }
        }
        return await this.prisma.category.update({
            where : {id : categoryId},
            data : {...dataUpdate, slug : currentslug}
        })
    }

    generateSlug (slug : string) {
        const short_randomUUID = crypto.randomUUID().split('-')[0];
        return slug = `${slug}-${short_randomUUID}` ;
    }
}

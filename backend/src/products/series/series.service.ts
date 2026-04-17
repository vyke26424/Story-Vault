import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { generateSlug } from 'src/helper/gen_slug.helper';
import { CreateSeriesDto, UpdateSeriesDto } from 'src/interface/dtos/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/upload/cloudinary/cloudinary.service';

@Injectable()
export class SeriesService {
    constructor(private readonly prisma : PrismaService,
        private readonly cloudService : CloudinaryService
    ){}

    async createSeries (data : CreateSeriesDto, file : Express.Multer.File){
        if(!file) {
            throw new BadRequestException('Hiện tại không cho upoad mà không có ảnh bìa');
        }

        const cloudUploaded = await this.cloudService.uploadImage(file, 'story_vault/series');
        const secureUrl = cloudUploaded.secure_url ;
        let currentslug = data.slug ? 
        slugify(data.slug,{
            lower : true,
            strict : true,
            locale : 'vi'
        }) : 
        slugify(data.title,{
            lower : true,
            strict : true,
            locale : 'vi'
        });

        const slugIsExists = await this.prisma.series.findUnique({
            where : {slug : currentslug}
        });

        if(slugIsExists) {
            currentslug = generateSlug(currentslug);
        }

        const {categoryIds, ...resData} = data;
        
        const validCategoryIds = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

        try {
            const newSerie = await this.prisma.series.create({
            data : {
                ...resData, 
                slug : currentslug,
                coverImage : secureUrl,
                categories : {
                    connect : validCategoryIds.map((id) =>({
                        id : id
                    }))
                }
            }
        }) ;
        return newSerie;
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
                throw new BadRequestException('Một hoặc nhiều category không tồn tại');
            }
            throw error ;
        }
    }

 // tạm thời data chưa lớn nên lấy toàn bộ, tối về limit sau 
    async getAllSeries() {
        return await this.prisma.series.findMany({
            include : {
                categories : true
            },
            orderBy : {
                createdAt : 'desc'
            }
        })
    }

    async getOneSeries (slug : string) {
        const series = await this.prisma.series.findUnique({
            where : {slug : slug},
            include : {
                categories : true,
                volumes : {
                    orderBy : {
                        volumeNumber : 'asc'
                    }
                }
            }
        });

        if(!series) {
            throw new BadRequestException('Truyện này không tồn tại hoặc đã bị gỡ');
        }
        return series;

    }

    async updateSeries (seriesId : string, data : UpdateSeriesDto, file? : Express.Multer.File) {
        let newImageUrl = undefined;
        if(file) {
            const uploadedCloud = await this.cloudService.uploadImage(file, 'story_vault/series');
            newImageUrl = uploadedCloud.secure_url ;
        }
        let currentslug : string | undefined;
        if(data.slug) {
            currentslug = data.slug;
            currentslug = slugify(currentslug,{
                lower : true,
                strict : true,
                locale : 'vi'
            });

            const slugIsExists = await this.prisma.series.findFirst({
                where : {slug : currentslug,
                    id : {not : seriesId}
                },
            });
            if(slugIsExists) {
                currentslug = generateSlug(currentslug);
            }
        }
        const {categoryIds, ...resData} = data ;
        const validCategoryIds = categoryIds ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds]) : undefined;

        const dataUpdated = await this.prisma.series.update({
            where : {id : seriesId},
            data : {
                ...resData,
                slug : data.slug ? currentslug : undefined,
                ...(newImageUrl ? { coverImage: newImageUrl } : {}), 

                ...(validCategoryIds && {categories : {
                    set : validCategoryIds.map((catId)=> ({
                        id : catId
                    }))
                }})
            }
        })
        return dataUpdated ;

    }
}

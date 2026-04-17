import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { generateSlug } from 'src/helper/gen_slug.helper';
import { CreateSeriesDto, UpdateSeriesDto } from 'src/interface/dtos/product.dto';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';


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


        async getAllSeries(cursorId?: string) {
        const seriesData = await this.prisma.series.findMany({
            where: { isActive: true },
            take: 20, 
            ...(cursorId && { 
                skip: 1, 
                cursor: { id: cursorId }
            }),
            orderBy: { createdAt: 'desc' }
        });


        const nextCursorId = seriesData.length > 0 ? seriesData[seriesData.length - 1].id : null;

        return {
            data: seriesData,
            nextCursor: nextCursorId
        };
    }


    async getOneSeries (slug : string) {
        const series = await this.prisma.series.findUnique({
            where : {slug : slug, isActive : true},
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

    async deleteSeries(seriesId : string) {
        if(!seriesId) return;
        const SeriesIsExists = await this.prisma.series.findUnique({
            where : {id : seriesId}
        });

        if(!SeriesIsExists) {
            throw new BadRequestException('Không tìm thấy series');
        }

        const dataDeleted = await this.prisma.series.update({
            where : {id : seriesId},
            data : {isActive : false}
        });

        return dataDeleted;
    }

    async getSeriesDeleted() {
        const seriesDeleted = await this.prisma.series.findMany({
            where : {isActive : false}
        });
        return seriesDeleted;
    }


    async restoreSeries(seriesId: string) {
        if (!seriesId) return;

        try {
            const dataRestore = await this.prisma.series.update({
                where: { id: seriesId }, 
                data: { isActive: true }
            });
            
            return dataRestore;

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new BadRequestException('Không tìm thấy truyện này hoặc ID sai!');
            }
            
            throw error; 
        }
    }



}

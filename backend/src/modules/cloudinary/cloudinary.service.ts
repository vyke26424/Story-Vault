import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadImage(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, rejects) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          transformation: [
            { width: 400, height: 600, crop: 'fill' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return rejects(error);
          resolve(result!);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadAvatar(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, rejects) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'storyvault/avatars', // Thư mục trên Cloudinary
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return rejects(error);
          resolve(result!);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}

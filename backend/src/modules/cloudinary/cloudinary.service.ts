/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
            {
              width: 400,
              height: 600,
              crop: 'fill',
            },
            {
              quality: 'auto',
              fetch_format: 'auto',
            },
          ],
        },
        (error, result) => {
          if (error) {
            return rejects(error);
          }
          resolve(result!);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}

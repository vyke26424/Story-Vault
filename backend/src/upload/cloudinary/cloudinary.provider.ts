import { ConfigService, ConfigType } from "@nestjs/config";

import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig from "src/config/cloudinary.config";

export const CloudinaryProvider = {
    provide : 'CLOUDINARY',
    inject : [cloudinaryConfig.KEY],
    useFactory : (config : ConfigType<typeof cloudinaryConfig>) => {
        return cloudinary.config({
            cloud_name : config.cloudName,
            api_key : config.apiKey,
            api_secret : config.apiSecret
        })
    }
}
import { Injectable } from "@nestjs/common";
import { ImageSizeDto } from "../dto/imageSize.dto.js";
import sharp, { Sharp } from "sharp";

@Injectable()
export class ImageService {

    async getResizedImage(image: Buffer, size: ImageSizeDto): Promise<Sharp> {
        const width = size.width ? Number(size.width) : undefined;
        const height = size.height ? Number(size.height) : undefined;
        return await sharp(image).resize(width, height).jpeg();
    }
}
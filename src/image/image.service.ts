import { Injectable } from "@nestjs/common";
import { ImageSizeDto } from "src/dto/imageSize.dto";
import sharp from "sharp";

@Injectable()
export class ImageService {

    async getResizedImage(image: Buffer, size: ImageSizeDto) {
        const width = size.width ? Number(size.width) : undefined;
        const height = size.height ? Number(size.height) : undefined;
        return await sharp(image).resize(width, height).toBuffer();
        //        sharp(image).resize(width, height).toFile("image.jpg", (err, info) => {
        //     if (err) console.log(err);
        //     else console.log(info.size);
        //   })
    }
}
import { PatternService } from './pattern.service';
import { ImageSizeDto } from "../dto/imageSize.dto"
import { ImageService } from 'src/image/image.service';
import { UseInterceptors } from 'node_modules/@nestjs/common/decorators/core/use-interceptors.decorator';
import { Body, UploadedFile } from 'node_modules/@nestjs/common/decorators/http/route-params.decorator';
import { Controller, Post } from 'node_modules/@nestjs/common/decorators/index';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller("pattern")
export class PatternController {
  constructor(
    private readonly imageService: ImageService
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async createPattern(@UploadedFile() image: Express.Multer.File, @Body() body: ImageSizeDto): Promise<string> {
    const img = await this.imageService.getResizedImage(image.buffer, body);
    return "Hello World";
  }
}


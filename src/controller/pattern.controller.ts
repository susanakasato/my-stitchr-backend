import { PatternService } from '../service/pattern.service.js';
import { ImageSizeDto } from "../dto/imageSize.dto.js";
import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Pattern } from 'src/model/pattern.js';

@Controller("pattern")
export class PatternController {
  constructor(
    private readonly patternService: PatternService, 
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async createPattern(@UploadedFile() image: Express.Multer.File, @Body() body: ImageSizeDto): Promise<string> {
    const pattern: Pattern = await this.patternService.createPattern(image.buffer, body);
    return "Hello World";
  }
}


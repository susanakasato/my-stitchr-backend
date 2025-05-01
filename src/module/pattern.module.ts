import { Module } from '@nestjs/common';
import { PatternController } from '../controller/pattern.controller.js';
import { ImageService } from '../service/image.service.js';
import { PatternService } from '../service/pattern.service.js';

@Module({
  imports: [],
  controllers: [PatternController],
  providers: [PatternService, ImageService],
})
export class PatternModule {}

import { Module } from '@nestjs/common';
import { PatternController } from './pattern.controller';
import { PatternService } from './pattern.service';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [],
  controllers: [PatternController],
  providers: [PatternService, ImageService],
})
export class PatternModule {}

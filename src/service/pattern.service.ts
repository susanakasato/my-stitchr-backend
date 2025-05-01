import { Injectable } from '@nestjs/common';
import { Sharp } from 'sharp';
import { ImageSizeDto } from '../dto/imageSize.dto.js';
import { ImageService } from './image.service.js';
import { Pattern } from '../model/pattern.js';
import { PatternColor } from '../model/patternColor.js';
import { SimilarDmc } from './similarDmc.service.js';

@Injectable()
export class PatternService {

    constructor(
        private readonly imageService: ImageService
    ) {}

    async createPattern(image: Buffer, size: ImageSizeDto): Promise<Pattern> {
        const sharp: Sharp = await this.imageService.getResizedImage(image, size);
        const {data, info} = await sharp.raw().toBuffer({resolveWithObject: true});
        const width = info.width;
        const height = info.height;
        const pattern = new Pattern(sharp, width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const redIndex = (3 * width * y) + (3 * x);
                const greenIndex = redIndex + 1;
                const blueIndex = greenIndex + 1;
                const patternColor: PatternColor = new PatternColor(Number.parseInt(data[redIndex].toString()), Number.parseInt(data[greenIndex].toString()), Number.parseInt(data[blueIndex].toString()));
                pattern.addPattermItem(x, y, patternColor);
            }
        }
        return this.optimizePattern(pattern);
    }

    optimizePattern(pattern: Pattern): Pattern {
        const changedDmcs: {
            [key: string]: string
        } = {};
        const usedColors: {
            [key: string]: PatternColor
        } = {};
        const optimizedPattern: Pattern = new Pattern(pattern.getImage(), pattern.getWidth(), pattern.getHeight());
        pattern.getGrid().forEach((line, y) => {
            line.forEach((patternItem, x) => {
                let currentPatternColor: PatternColor = patternItem.getPatternColor();
                const currentDmc: string = currentPatternColor.getDmc();
                let newPatternColor: PatternColor = usedColors[currentDmc];
                if (!newPatternColor) {
                    const changedDmc = changedDmcs[currentDmc];
                    if (changedDmc) {
                        optimizedPattern.addPattermItem(x, y, newPatternColor);
                    } else {
                        const similarDmcs: string[] = SimilarDmc.getSimilarDmcs(currentDmc);
                        let similarDmcsIndex = 0;
                        while (similarDmcsIndex < SimilarDmc.length && !newPatternColor) {
                            const similarUsedColor = usedColors[similarDmcs[similarDmcsIndex]];
                            if (similarUsedColor) {
                                newPatternColor = similarUsedColor;
                                changedDmc[currentDmc] = similarUsedColor.getDmc();
                            }
                            similarDmcsIndex++;
                        }
                    }
                    if (!newPatternColor) {
                        newPatternColor = currentPatternColor;
                        usedColors[currentDmc] = newPatternColor;
                    }
                }
                optimizedPattern.addPattermItem(x, y, newPatternColor);
            })
        })

        return optimizedPattern;
    } 

    
  
}

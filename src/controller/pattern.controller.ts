import { PatternService } from '../service/pattern.service.js';
import { ImageSizeDto } from "../dto/imageSize.dto.js";
import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Header, HttpCode, HttpException, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Pattern } from '../model/pattern.js';
import PDFDocument from "pdfkit/js/pdfkit.js";
import { PdfService } from '../service/pdf.service.js';

@Controller("pattern")
export class PatternController {
  constructor(
    private readonly patternService: PatternService, 
    private readonly pdfService: PdfService
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  @HttpCode(HttpStatus.CREATED)
  @Header("Content-Type", "application/pdf")
  @Header("Content-Disposition", "attachment; filename=pattern.pdf")
  async createPattern(@UploadedFile() image: Express.Multer.File, @Body() body: ImageSizeDto, @Res() res: Response): Promise<string> {
    let width, height;    
    if (!image.mimetype.startsWith("image/")) {
      throw new HttpException("Ops! This image format is not allowed.", HttpStatus.BAD_REQUEST);
    }
    try {
      width = Number(body.width);
      height = Number(body.height);
    } catch (e) {
      throw new HttpException("Ops! The value provided to the pattern size must be a number.", HttpStatus.BAD_REQUEST);
    }
    const pattern: Pattern = await this.patternService.createPattern(image.buffer, {width: width, height: height});
    const doc: PDFDocument = await this.pdfService.createDoc(pattern);
    doc.pipe(res)
    doc.end();    
    return "Success! Your cross stitch pattern was created and it's available in PDF.";
  }
}


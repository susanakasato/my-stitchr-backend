import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import PDFDocument from "pdfkit/js/pdfkit.js";
import { Sharp } from "sharp";
import { ImageSizeDto } from "src/dto/imageSize.dto.js";
import { Pattern } from "src/model/pattern.js";

@Injectable()
export class PdfService {

    async createDoc(pattern: Pattern): PDFDocument {
        const doc: PDFDocument = new PDFDocument();
        await this.addInitialSetup(doc, pattern.getImage());
        return doc;
    }

    async addInitialSetup(doc: PDFDocument, image: Sharp): Promise<void> {
        doc.fontSize(32)
            .font("Helvetica-Bold")
            .text("Cross Stitch Pattern", {align: "center"});
        doc.moveDown();
        const fileName = "../../output.jpg";
        await image.jpeg().toFile(fileName);
        doc.image(fileName, (doc.page.width - 250) / 2, 150, {width: 250, fit: [250, doc.page.height], valign: "top"})
            
    }
}
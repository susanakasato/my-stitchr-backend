import { Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit/js/pdfkit.js";
import { Sharp } from "sharp";
import { Pattern } from "src/model/pattern.js";
import { PatternItem } from "src/model/patternItem.js";

@Injectable()
export class PdfService {

    private cellSize: number = 10;
    private xCellPerPage: number = 50;
    private yCellPerPage: number = 70;
    private xInitPosition: number = 55;
    private yInitPosition: number = 35;


    async createDoc(pattern: Pattern): PDFDocument {
        const doc: PDFDocument = new PDFDocument({size: "A4"});
        await this.addInitialSetup(doc, pattern.getOriginalImage());
        this.addGrid(doc, pattern.getGrid());
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

    addGrid(doc: PDFDocument, grid: PatternItem[][]) {

    }

    addStitchItem(doc: PDFDocument, x: number, y: number, colorHex: string, symbol: string) {
        doc.rect(this.xInitPosition + x, this.yInitPosition + y, this.cellSize, this.cellSize)
            .fillColor(colorHex)
            .strokeColor("gray")
            .fillOpacity(0.8)
            .fillAndStroke();
        doc.fontSize(8)
            .fillColor("black")
            .text(symbol, this.xInitPosition + 2, this.yInitPosition + 2);
    }

    addGridIndexes(doc: PDFDocument, gridWidth: number, gridHeight: number, xInitIndex: number, yInitIndex) {
        doc.fontSize(8).font("Helvetica-Bold");
        for (let y = 0; y < gridHeight; y += 10) {
            const yPosition = this.yInitPosition + y * 10;
            const xPositionOfYIndex = this.xInitPosition - 15;
            const yPositionOfXIndex = yPosition - 12;
            let ySize = 100;
            if (y + 10 > gridHeight) ySize = (gridHeight - y) * 10;
            doc.text((yInitIndex + y).toString(), xPositionOfYIndex, yPosition - 5);
            if (y + 10 >= gridHeight) doc.text((yInitIndex + gridHeight).toString(), xPositionOfYIndex, yPosition - 5 + (gridHeight - y) * 10);
            for (let x = 0; x < gridWidth; x += 10) {
                    const xPosition = this.xInitPosition + x * 10;
                    let xSize = 100;
                    if (x + 10 > gridWidth) xSize = (gridWidth - x) * 10;
                    doc.rect(xPosition, yPosition, xSize, ySize).strokeColor("black").stroke();
                    if (y == 0) {
                        doc.text((xInitIndex + x).toString(), xPosition - 5, yPositionOfXIndex);
                        if (x + 10 >= gridWidth) doc.text((xInitIndex + gridWidth).toString(), xPosition - 5 + (gridWidth - x) * 10, yPositionOfXIndex);
                    }
                }
        }
    }
}
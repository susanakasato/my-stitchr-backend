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
    private yInitPosition: number = 55;
    private indexCellWidth = 46;
    private indexCellHeight = 18;


    async createDoc(pattern: Pattern): PDFDocument {
        const doc: PDFDocument = new PDFDocument({size: "A4"});
        await this.addInitialSetup(doc, pattern.getOriginalImage());
        this.addGrid(doc, pattern.getGrid(), pattern.getWidth(), pattern.getHeight());
        this.addColorsPage(doc, pattern.getPatternItemsIndex());
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

    addGrid(doc: PDFDocument, grid: PatternItem[][], gridWidth: number, gridHeight: number) {
        const widthCount: number = Math.ceil(gridWidth / this.xCellPerPage);
        const heightCount: number = Math.ceil(gridHeight / this.yCellPerPage);
        for (let yCount = 0; yCount < heightCount; yCount++) {
            for (let xCount = 0; xCount < widthCount; xCount++) {
                doc.addPage();
                for (let y = yCount * this.yCellPerPage; y < (yCount + 1) * this.yCellPerPage && y < gridHeight; y++) {
                    for (let x = xCount * this.xCellPerPage; x < (xCount + 1) * this.xCellPerPage && x < gridWidth; x++) {
                        const item = grid[y][x]
                        this.addStitchItem(doc, (x - xCount * this.xCellPerPage) * this.cellSize, (y - yCount * this.yCellPerPage) * this.cellSize, item.getPatternColor().getColor().hex(), item.getSymbol());
                    }
                }
                const pageGridWidth = xCount == widthCount - 1 ? gridWidth - (xCount * this.xCellPerPage) : this.xCellPerPage;
                const pageGridHeight = yCount == heightCount - 1 ? gridHeight - (yCount * this.yCellPerPage) : this.yCellPerPage;
                this.addGridIndexes(doc, pageGridWidth, pageGridHeight, xCount * this.xCellPerPage, yCount * this.yCellPerPage);
            }
        }
    }

    addStitchItem(doc: PDFDocument, x: number, y: number, colorHex: string, symbol: string) {
        doc.rect(this.xInitPosition + x, this.yInitPosition + y, this.cellSize, this.cellSize)
            .fillColor(colorHex)
            .strokeColor("gray")
            .fillOpacity(0.6)
            .fillAndStroke();
        doc.fontSize(6)
            .fillColor("black")
            .fillOpacity(1)
            .text(symbol, this.xInitPosition + x, this.yInitPosition + y + 3, {width: 10, align: "center"});
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

    addColorsPage(doc: PDFDocument, patternItemsIndex: {[dmc: string]: PatternItem}) {
        const dmcs = Object.keys(patternItemsIndex);
        const itemsPerColumn = 40;
        const columns = Math.ceil(dmcs.length / itemsPerColumn);
        const columnSpaceBetween = 30;

        doc.addPage();
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            this.addColorCell(doc, columnIndex * (3 * this.indexCellWidth + columnSpaceBetween),
                0 - this.indexCellHeight, "DMC");
            this.addColorCell(doc, this.indexCellWidth + columnIndex * (3 * this.indexCellWidth + columnSpaceBetween),
                0 - this.indexCellHeight, "Symbol");
            this.addColorCell(doc, 2 * this.indexCellWidth + columnIndex * (3 * this.indexCellWidth + columnSpaceBetween),
                0 - this.indexCellHeight, "Count");
            for (let itemIndex = 0; itemIndex < itemsPerColumn && itemIndex + columnIndex * itemsPerColumn < dmcs.length; itemIndex++) {
                const item = patternItemsIndex[dmcs[itemIndex + columnIndex * itemsPerColumn]];
                this.addColorCell(doc, columnIndex * (3 * this.indexCellWidth + columnSpaceBetween),
                    itemIndex * this.indexCellHeight, 
                    item.getPatternColor().getDmc());
                this.addColorCell(doc, this.indexCellWidth + columnIndex * (3 * this.indexCellWidth + columnSpaceBetween),
                    itemIndex * this.indexCellHeight, 
                    "");
                this.addStitchItem(doc, this.indexCellWidth + columnIndex * (3 * this.indexCellWidth + columnSpaceBetween) + 18,
                    itemIndex * this.indexCellHeight + 4,
                    item.getPatternColor().getColor().hex(),
                    item.getSymbol())
                this.addColorCell(doc, 2 * this.indexCellWidth + columnIndex * (3 * this.indexCellWidth + columnSpaceBetween),
                    itemIndex * this.indexCellHeight, 
                    item.getStitchCount());
            }
        }
    }

    addColorCell(doc, x, y, text) {
        doc.fillOpacity(1)
            .fillColor("white")
            .strokeColor("black")
            .rect(this.xInitPosition + x, this.yInitPosition + y, this.indexCellWidth, this.indexCellHeight)
            .fillAndStroke();
        doc.fillColor("black")
            .fontSize(10)
            .text(text, this.xInitPosition + x, this.yInitPosition + y + 5, {width: this.indexCellWidth, align: "center"})
    }
}
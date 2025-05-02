import { Sharp } from "sharp"
import { PatternItem } from "./patternItem.js";
import Symbols from "./symbol.js";
import { PatternColor } from "./patternColor.js";

export class Pattern {

    private originalImage: Sharp;
    private image: Sharp;
    private width: number;
    private height: number;
    private grid: PatternItem[][];
    private usedItems: {
        [key: string]: PatternItem
    };
    private usedSymbols: string[];

    constructor(originalImage: Sharp, image: Sharp, width: number, height: number) {
        this.originalImage = originalImage;
        this.image = image;
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill(Array(width).fill(null));
        this.usedItems = {};
        this.usedSymbols = [];
    }

    getOriginalImage(): Sharp {
        return this.originalImage;
    }

    getImage(): Sharp {
        return this.image;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getGrid(): PatternItem[][] {
        return this.grid;
    }

    getPatternItemsIndex(): {[dmc: string]: PatternItem} {
        return this.usedItems;
    }

    addPattermItem(x: number, y: number, patternColor: PatternColor): void {       
        let newItem = this.usedItems[patternColor.getDmc()];
        if (!newItem) {
            let newSymbol: string = "";
            let i = 0;
            while (newSymbol == "" && i < Symbols.length) {
                if (!this.usedSymbols.includes(Symbols[i])) {
                    newSymbol = Symbols[i];
                    this.usedSymbols.push(newSymbol);
                }
                i++;
            }
            newItem = new PatternItem(patternColor, newSymbol);
            this.usedItems[patternColor.getDmc()] = newItem;
        }
        newItem.addOneSticth();
        const newLine: PatternItem[] = [...this.grid[y]];
        newLine[x] = newItem;
        this.grid[y] = [...newLine];
    }
}
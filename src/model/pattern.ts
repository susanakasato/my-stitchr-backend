import { Sharp } from "sharp"
import { PatternItem } from "./patternItem.js";
import Symbol, { SymbolType } from "./symbol.js";
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
    private usedSymbols: {
        [key: string]: SymbolType
    }

    constructor(originalImage: Sharp, image: Sharp, width: number, height: number) {
        this.originalImage = originalImage;
        this.image = image;
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill(Array(width).fill(null));
        this.usedItems = {};
        this.usedSymbols = {};
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

    addPattermItem(x: number, y: number, patternColor: PatternColor): void {
        let newItem = this.usedItems[patternColor.getDmc()];
        if (!newItem) {
            let newSymbol: SymbolType = "";
            let i = 0;
            const symbolKeys = Object.keys(Symbol);
            while (newSymbol == "" && i < symbolKeys.length) {
                if (!this.usedSymbols[Symbol[symbolKeys[i]]]) newSymbol = Symbol[symbolKeys[i]];
                i++;
            }
            newItem = new PatternItem(patternColor, newSymbol);
            this.usedItems[patternColor.getDmc()] = newItem;
        }
        newItem.addOneSticth();
        this.grid[y][x] = newItem;
    }

}
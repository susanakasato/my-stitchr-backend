import { PatternColor } from "./patternColor.js";
import { SymbolType } from "./symbol.js";

export class PatternItem {

    private patternColor: PatternColor;
    private symbol: SymbolType;
    private stitchCount: number;

    constructor(patternColor: PatternColor, symbol: string) {
        this.patternColor = patternColor;
        this.symbol = symbol;
        this.stitchCount = 0;
    }

    getPatternColor(): PatternColor {
        return this.patternColor;
    }

    getSymbol(): SymbolType {
        return this.symbol;
    }

    getStitchCount(): number {
        return this.stitchCount;
    }

    addOneSticth(): void {
        this.stitchCount++;
    }
}
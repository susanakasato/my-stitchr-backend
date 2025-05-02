import { PatternColor } from "./patternColor.js";

export class PatternItem {

    private patternColor: PatternColor;
    private symbol: string;
    private stitchCount: number;

    constructor(patternColor: PatternColor, symbol: string) {
        this.patternColor = patternColor;
        this.symbol = symbol;
        this.stitchCount = 0;
    }

    getPatternColor(): PatternColor {
        return this.patternColor;
    }

    getSymbol(): string {
        return this.symbol;
    }

    getStitchCount(): number {
        return this.stitchCount;
    }

    addOneSticth(): void {
        this.stitchCount++;
    }

}
import { Pattern } from "src/model/pattern.ts";
import { PatternColor } from "src/model/patternColor.ts";
import { describe, expect, it } from "vitest";

describe("MODEL VITEST TESTING", () => {
    it("Pattern - adding Pattern Item", () => {
        const pattern = new Pattern(null, null, 2, 2);
        pattern.addPattermItem(0, 0, new PatternColor(255, 255, 255));
        pattern.addPattermItem(1, 0, new PatternColor(0, 0, 0));
        pattern.addPattermItem(0, 1, new PatternColor(100, 110, 100));
        pattern.addPattermItem(1, 1, new PatternColor(255, 255, 255));
        expect(pattern.getGrid()[0][0].getSymbol()).toBe("A");
        expect(pattern.getGrid()[0][1].getSymbol()).toBe("B");
        expect(pattern.getGrid()[1][0].getSymbol()).toBe("C");
        expect(pattern.getGrid()[1][1].getSymbol()).toBe("A");
        expect(pattern.getGrid()[0][0].getPatternColor().getDmc()).toBe("B5200");
    });
});
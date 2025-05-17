import { Pattern } from "src/model/pattern.js";
import { PatternColor } from "src/model/patternColor.js";
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

    it("Pattern Color", () => {
        const patternColor: PatternColor = new PatternColor(150, 150, 150);
        expect(patternColor.getDmc()).toBe("414");
        expect(patternColor.getName()).toBe("Steel Gray Dark");
        expect(patternColor.getRgb()).toBe(9211020);
    })
});
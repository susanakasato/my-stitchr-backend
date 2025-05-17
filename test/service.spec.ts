import { Pattern } from "src/model/pattern.js";
import { PatternColor } from "src/model/patternColor.js";
import { PatternService } from "src/service/pattern.service.js";
import { RgbToDmcService } from "src/service/rgbToDmc.service.js";
import { SimilarDmcService } from "src/service/similarDmc.service.js";
import { describe, expect, it } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { ImageService } from "src/service/image.service.js";
import sharp, { Metadata, Sharp } from "sharp";
import { create } from "domain";

describe("SERVICE VITEST TESTING", () => {
    it("RGB to DMC Service", () => {
        const rgbJson = {
            name: "Coral Red Very Dark",
            rgb: "12256543",
            dmc: "817",
            red: "187",
            green: "5",
            blue: "31"
        };
        expect(RgbToDmcService.data["12256543"]).toStrictEqual(rgbJson);
        expect(RgbToDmcService.getName("12256543")).toBe("Coral Red Very Dark");
        expect(RgbToDmcService.getDmc("12256543")).toBe("817");
        expect(RgbToDmcService.getRed("15375556")).toBe(234);
        expect(RgbToDmcService.getGreen("15375556")).toBe(156);
        expect(RgbToDmcService.getBlue("15375556")).toBe(196);
        expect(RgbToDmcService.getSimilarRgb(150, 150, 150)).toBe(9211020);
    })

    it("Similar DMC Service", () => {
        expect(SimilarDmcService.getSimilarDmcs("841")).toStrictEqual([
            "3863",
            "3864",
            "407",
            "3064",
            "3045",
            "612",
            "3032",
            "3859",
            "422",
            "642",
            "371",
            "3861",
            "3895",
            "436"
        ]);
    });

    it("Pattern Service", async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [PatternService]
        }).compile();
        const service: PatternService = moduleRef.get<PatternService>(PatternService);
        const pattern: Pattern = new Pattern(null, null, 2, 2);
        pattern.addPattermItem(0, 0, new PatternColor(150, 150, 150));
        pattern.addPattermItem(1, 0, new PatternColor(144, 134, 169));
        pattern.addPattermItem(0, 1, new PatternColor(0, 0, 120));
        pattern.addPattermItem(1, 1, new PatternColor(144, 134, 169));
        const optimizedPattern = service.optimizePattern(pattern);
        expect(optimizedPattern.getGrid()[0][0].getSymbol()).toBe("A");
        expect(optimizedPattern.getGrid()[0][1].getSymbol()).toBe("A");
        expect(optimizedPattern.getGrid()[1][0].getSymbol()).toBe("B");
        expect(optimizedPattern.getGrid()[1][1].getSymbol()).toBe("A");
    });

    it("Image Service", async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [ImageService]
        }).compile();
        const service: ImageService = moduleRef.get<ImageService>(ImageService);

        const image: Buffer = await sharp({
            create: {
                width: 20,
                height: 20,
                channels: 3,
                background: {r: 255, g: 0, b: 0}
            }
        }).png().toBuffer();
        const newImageSharp: Sharp = await service.getResizedImage(image, {width: "10", height: "10"});
        const newImageSharpMetadata: Metadata = await newImageSharp.metadata();
        expect(newImageSharpMetadata.width).toBe(10);
        expect(newImageSharpMetadata.height).toBe(10);
    });
});
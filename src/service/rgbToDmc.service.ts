import { readFileSync } from "fs";
import { RgbToDmcDto } from "../dto/rgbToDmc.dto.js";

export class RgbToDmcService {

    static data: RgbToDmcDto;

    static {
        this.data = JSON.parse(readFileSync("resource/rgb-dmc.json").toString());
    } 

    static getName(rgb: string): string {
        return this.data[rgb].name;
    }

    static getDmc (rgb: string): string {
        return this.data[rgb].dmc;
    }

    static getRed(rgb: string): number {
        return Number.parseInt(this.data[rgb].red);
    }

    static getGreen(rgb: string): number {
        return Number.parseInt(this.data[rgb].green);
    }

    static getBlue(rgb: string): number {
        return Number.parseInt(this.data[rgb].blue);
    }

    static getSimilarRgb(red: number, green: number, blue: number): number {
        let similarRgb = null;
        let bestDiff = null;
        Object.keys(this.data).forEach(key => {
            const diff = Math.abs(red - this.getRed(key))
                + Math.abs(green - this.getGreen(key))
                + Math.abs(blue - this.getBlue(key));
            if (bestDiff == null || bestDiff > diff) {
                bestDiff = diff;
                similarRgb = key;
            }
        })
        return Number.parseInt(similarRgb);
    }
}
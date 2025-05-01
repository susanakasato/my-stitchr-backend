import { ColorInstance } from "color";
import { RgbToDmcService } from "../service/rgbToDmc.service.js";
import Color from "color";

export class PatternColor {
    private rgb: number;
    private color: ColorInstance;
    private name: string;
    private dmc: string;

    constructor(red: number, green: number, blue: number) {
        this.rgb = RgbToDmcService.getSimilarRgb(red, green, blue);
        this.color = new Color(this.rgb, "rgb");
        this.name = RgbToDmcService.getName(this.rgb.toString());
        this.dmc = RgbToDmcService.getDmc(this.rgb.toString());
    }

    getRgb(): number {
        return this.rgb;
    }

    getColor() {
        return this.color;
    }

    getName(): string {
        return this.name;
    }

    getDmc(): string {
        return this.dmc;
    }
}
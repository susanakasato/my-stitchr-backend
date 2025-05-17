import { readFileSync } from "fs";
import { SimilarDmcDto } from "../../src/dto/similarDmc.dto.js";

export class SimilarDmcService {
    
    static data: SimilarDmcDto;

    static {
        this.data = JSON.parse(readFileSync("resource/similar-dmc.json").toString());
    }

    static getSimilarDmcs(dmc: string): string[] {
        return this.data[dmc];
    }
}
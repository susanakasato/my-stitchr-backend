import { readFileSync } from "fs";

export class SimilarDmc {
    
    static data: SimilarDmc;

    static {
        this.data = JSON.parse(readFileSync("resource/similar-dmc.json").toString());
    }

    static getSimilarDmcs(dmc: string): string[] {
        return this.data[dmc];
    }
}
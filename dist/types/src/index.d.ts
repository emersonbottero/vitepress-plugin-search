import { Plugin } from "vite";
import { Options } from "./types";
export interface SearchData {
    PREVIEW_LOOKUP: string;
    INDEX_DATA: string;
    Options: Options;
}
export declare function SearchPlugin(inlineOptions?: Partial<any>): Plugin;

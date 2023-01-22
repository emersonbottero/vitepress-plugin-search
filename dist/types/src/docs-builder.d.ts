import { Options } from "./types";
interface Doc {
    id: string;
    link: string;
    b: string;
    a: string;
    t?: string;
}
declare const buildDocs: (HTML_FOLDER: string, options: Options) => Promise<Doc[]>;
export default buildDocs;

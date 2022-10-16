//@ts-ignore
import lunr from "./lunr-esm.js";
import MarkdownIt from "markdown-it";
import { Options } from "./types.js";
import buildDocs from "./docs-builder.js";
const md = new MarkdownIt();

const SEARCH_FIELDS = ["body", "anchor"];
let MAX_PREVIEW_CHARS = 62; // Number of characters to show for a given search result

const buildIndex = (docs: any[]) => {
  const idx = lunr((x: any) => {
    x.ref("id");
    for (let i = 0; i < SEARCH_FIELDS.length; i++) {
      x.field(SEARCH_FIELDS[i].slice(0, 1));
    }
    docs.forEach(function (doc: any) {
      x.add(doc);
    }, x);
  });
  return idx;
};

function buildPreviews(docs: any[]) {
  const result: any = {};
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    // console.log(doc);
    let preview = md.render(doc["b"]).replace(/(<([^>]+)>)/gi, "");
    if (preview == "") preview = doc["b"];

    if (preview.length > MAX_PREVIEW_CHARS)
      preview = preview.slice(0, MAX_PREVIEW_CHARS) + " ...";

    result[doc["id"]] = {
      t: doc["a"],
      p: preview,
      l: doc["link"],
      a: doc["a"], //
    };
  }
  return result;
}

export async function IndexSearch(
  HTML_FOLDER: string,
  options: Options
): Promise<string> {
  console.log("  🔎 Indexing...");
  if (options.previewLength) MAX_PREVIEW_CHARS = options.previewLength;
  const docs = await buildDocs(HTML_FOLDER, options);
  const idx = buildIndex(docs);
  const previews = buildPreviews(docs);
  const js: string = `const LUNR_DATA = ${JSON.stringify(idx)};
  const PREVIEW_LOOKUP = ${JSON.stringify(previews)};
  const Options = ${JSON.stringify(options)};
  const data = { LUNR_DATA, PREVIEW_LOOKUP, Options };
  export default data;`;
  console.log("  🔎 Done.");

  return js;
}

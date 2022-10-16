import { Plugin } from "vite";
import { IndexSearch } from "./md-index-builder";
import { Options } from "./types";

export interface myModule {
  PREVIEW_LOOKUP: string;
  LUNR_DATA: string;
  Options: Options;
}

const DEFAULT_OPTIONS: Options = {
  wildcard: false,
  previewLength: 62,
};

export function SearchPlugin(inlineOptions?: Partial<Options>): Plugin {
  // eslint-disable-next-line no-unused-vars
  const options = {
    ...DEFAULT_OPTIONS,
    ...inlineOptions,
  };

  let config: any;
  const virtualModuleId = "virtual:search-data";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-search",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    config: () => ({
      resolve: {
        alias: { "./VPNavBarSearch.vue": "vitepress-plugin-search/Search.vue" },
      },
    }),

    configureServer(server) {
      server.ws.send("my:greetings", { msg: "hello" });

      server.ws.on("my:from-client", (data, client) => {
        console.log("Message from client:", data.msg); // Hey!
        // reply only to the client (if needed)
        client.send("my:ack", { msg: "Hi! I got your message!" });
      });
    },

    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(this, id) {
      if (id === resolvedVirtualModuleId) {
        if (!config.build.ssr) {
          //so we don't compute index search twice
          let index = await IndexSearch(config.root, options);
          return index;
        }
        return `const LUNR_DATA = { "version": "2.3.9", "fields": ["b", "a"], "fieldVectors": [], "invertedIndex": [], "pipeline": ["stemmer"] };
				const PREVIEW_LOOKUP = {};
				const Options = ${JSON.stringify(options)};
				const data = { LUNR_DATA, PREVIEW_LOOKUP, Options };
				export default data;`;
      }
    },
  };
}

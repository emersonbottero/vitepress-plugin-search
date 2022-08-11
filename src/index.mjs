// import { Plugin } from "vite";
// import * as fs from "fs";
// import { IndexSearch } from "./node";

// export interface Options {
//   // add plugin options here
// }

const DEFAULT_OPTIONS = {
  // set default values
};

export function SearchPlugin(inlineOptions) {
  // eslint-disable-next-line no-unused-vars
  const options = {
    ...DEFAULT_OPTIONS,
    ...inlineOptions,
  };

  let config;
  const virtualModuleId = "virtual:my-module";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  return {
    name: "vitepress-plugin-search",
    enforce: "post",

    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },

    config: () => ({
      resolve: {
        alias: {
          "./VPNavBarSearch.vue": "vite-plugin-search/Search.vue",
        },
      },
    }),

    async buildEnd() {
      // const { root, base } = config;
      const { outDir } = config.build;

      setTimeout(() => {
        if (fs.existsSync(outDir)) {
          console.log("creating search index...");
          // const files = fs.readdirSync(outDir);
          console.dir(config.resolve);
          IndexSearch(outDir);
        }
      }, 2000);
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`;
      }
    },
  };
}

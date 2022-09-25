const path = require("path");
const { defineConfig } = require("vite");
import { viteStaticCopy } from "vite-plugin-static-copy";
// import vue from '@vitejs/plugin-vue';

module.exports = defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/Search.vue",
          dest: "./",
        },
        {
          src: "src/lunr-esm.js",
          dest: "./",
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SearchPlugin",
      fileName: (format: string) =>
        format == "es"
          ? `vitepress-plugin-search.${format}.mjs`
          : `vitepress-plugin-search.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "cheerio", "markdown-it", "fs/promises"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});

> :warning: **WIP**: First working version, no configuration provided!

Provide local search to your documentation site using [lunr](https://lunrjs.com/).  
It works for standard vitepress docs using the doc folder.

## Getting Started

Basic Steps to make it work!

## Installing

```js
npm i vitepress-plugin-search -D
```

## Setup

- Since we are using the same slot as the default algolia search let's create an alias so our component is used instead

```js
//docs/vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "./components/AlgoliaSearchBox.vue":
        "vitepress-plugin-search/src/Search.vue",
    },
  },
});
```

- Add an algolia entry just to pass the v-if in the slots

```js
//.vitepress/config.js
    themeConfig: {
        ...
        algolia: {},
        ...
    }
```

- Add scripts to build the index

```js
"predev": "npm run index",
"posbuild": "npm run index",
"index": "node ./node_modules/vitepress-plugin-search/src/index.js"
```

- Build once before running dev.

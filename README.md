## Provides local search to your documentation site

Uses [flexsearch](https://github.com/nextapps-de/flexsearch).

## Installing

```js
npm i vitepress-plugin-search markdown-it flexsearch -D
```

## Add the plugin

```js
//vite.config.ts
import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";

var options = {};

export default defineConfig({
  plugins: [SearchPlugin(options)],
});
```

## Options

Accept FlexSearch Index Options, see the [docs](https://github.com/nextapps-de/flexsearch#options)

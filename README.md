## Provides local search to your documentation site

Uses [flexsearch](https://github.com/nextapps-de/flexsearch).

## Installing

```js
npm i vitepress-plugin-search flexsearch -D
```

## Add the plugin

```js
//vite.config.ts
import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";

//default options
var options = {
  ...flexSearchIndexOptions,
  previewLength: 62,
  buttonLabel: "Search",
  placeholder: "Search docs",
};

export default defineConfig({
  plugins: [SearchPlugin(options)],
});
```

## Options

Accept [FlexSearch Index Options](https://github.com/nextapps-de/flexsearch#options)

## Multi language support

Provided by flexsearch  
  
See [chinese settings for example](https://github.com/emersonbottero/vitepress-plugin-search/issues/11)

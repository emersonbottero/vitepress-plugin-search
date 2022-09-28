Provide local search to your documentation site using [lunr](https://lunrjs.com/).

## Installing

```js
npm i vitepress-plugin-search markdown-it -D
```

## Add the plugin

```js
//vite.config.ts
import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [SearchPlugin()],
});
```

## Options

Default values!

```js
{
  //Add a wildcard at the end of the search
  wildcard: false,
  //The length of the result search preview item
  previewLength: 62,
}
```

Provide local search to your documentation site using [lunr](https://lunrjs.com/).

## Installing

```js
npm i vitepress-plugin-search -D
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

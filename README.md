Provide local search to your documentation site using [lunr](https://lunrjs.com/).  
It works for standard vitepress docs using the doc folder.

## Installing

```js
npm i vitepress-plugin-search -D
```

## Add the plugin

```js
//vite.config.ts
import { SearchPlugin } from 'vitepress-plugin-search';
import { defineConfig } from "vite";

	
export default defineConfig({
	plugins: [SearchPlugin()]
});
```

🚧 Know issue, when adding a base to the config dev mode don't work. you can still build and serve though!
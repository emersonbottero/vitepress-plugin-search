// import { SearchPlugin } from '../../vite-plugin-search/dist/index.mjs';
import { SearchPlugin } from 'vitepress-plugin-search';
// import Inspect from 'vite-plugin-inspect';
import { defineConfig } from "vite";

	
export default defineConfig({
	plugins: [SearchPlugin()],
	resolve: {
		alias: {"./VPNavBarSearch.vue": "vitepress-plugin-search/Search.vue"},
  	},
});
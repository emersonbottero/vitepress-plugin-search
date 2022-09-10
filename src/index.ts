import { Plugin } from 'vite';
const fs = require('fs');
const path = require('path');
const { readdir } = require('fs').promises;
import { IndexSearch } from './md-index-builder';

export function getFilesOnDisk() {
    return {
      name: 'getFilesOnDisk',
      options: {
        sequential: true,
        order: 'post',
        async handler({ dir }) {
		 console.log("\nsearching.. ", dir);
          //const topLevelFiles = await readdir(resolve(dir));
		  await delay(1000)
          console.log("\ntopLevelFiles");
        }
      }
    };
  }

export interface Options {
	// add plugin options here
}

export interface myModule {
	PREVIEW_LOOKUP: string,
	LUNR_DATA: string
}

const DEFAULT_OPTIONS: Options = {
	// set default values
	//TODO: Add index options like preview size
};

export function SearchPlugin(inlineOptions?: Partial<Options>): Plugin {
	// eslint-disable-next-line no-unused-vars
	const options = {
		...DEFAULT_OPTIONS,
		...inlineOptions
	};

	let config: any;
	const virtualModuleId = 'virtual:my-module';
	const resolvedVirtualModuleId = '\0' + virtualModuleId;

	return {
		name: 'vite-plugin-search',
		enforce: 'pre',
		configResolved(resolvedConfig) {
			// store the resolved config
			// console.log(resolvedConfig);
			config = resolvedConfig;
		},

		config: () => ({
			resolve: {
				alias: {"./VPNavBarSearch.vue": "vitepress-plugin-search/Search.vue"}
			}
		}),

		// transform(src, id) {						
		// 	if(id.includes('VPNavBarSearch.vue'))
		// 		return {
		// 		code: src.replace("./VPNavBarSearch.vue", "@emersonbottero/vite-plugin-search/dist/client/VPNavBarSearch.vue" ),
		// 		map: null,
		// 		};
		//   },

		async resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		async load(this,id, options) {
			if (id === resolvedVirtualModuleId) {
				if(!config.build.ssr){ //so we don't compute index search twice
					let index = await IndexSearch(config.root)
					return index
				}
				return `const LUNR_DATA = { "version": "2.3.9", "fields": ["b", "a"], "fieldVectors": [], "invertedIndex": [], "pipeline": ["stemmer"] };
				const PREVIEW_LOOKUP = {};
				const data = { LUNR_DATA, PREVIEW_LOOKUP };
				export default data;`;
			}
		},
	
	};
}

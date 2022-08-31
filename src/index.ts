import { Plugin } from 'vite';
import * as fs from 'fs';
import { IndexSearch } from './index-builder';
// import Search from './Search.vue'

export interface Options {
	// add plugin options here
}

export interface myModule {
	msg: string
}

const DEFAULT_OPTIONS: Options = {
	// set default values
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
		// enforce: 'post',

		configResolved(resolvedConfig) {
			// store the resolved config
			config = resolvedConfig;
		},

		// config: () => ({
		// 	resolve: {
		// 		alias: {
		// 			'./VPNavBarSearch.vue': 'vitepress-plugin-search/dist/Search.vue'
		// 		}
		// 	}
		// }),

		async buildEnd() {
			// const { root, base } = config;
			const { outDir } = config.build;

			setTimeout(() => {
				if (fs.existsSync(outDir)) {
					console.log('creating search index...');
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
		// transform(src, id) {						
		// 	if(id.includes('VPNavBarSearch.vue'))
		// 		return {
		// 		code: src.replace("./VPNavBarSearch.vue", "@emersonbottero/vite-plugin-search/dist/client/VPNavBarSearch.vue" ),
		// 		map: null,
		// 		};
		//   },
	};
}

// export {Search};

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
};

// const getFileList = async (dirName: string): Promise<string[]> => {
//     let files = [] as string[];
//     const items = await readdir(dirName, { withFileTypes: true });

//     for (const item of items) {
//         if (item.isDirectory()) {
//             files = [
//                 ...files,
//                 ...(await getFileList(`${dirName}/${item.name}`)),
//             ];
//         } else {
// 			if(item.name.endsWith(".md"))
//             	files.push(`${dirName}/${item.name}`);
//         }
//     }

//     return files;
// };

// const removeScriptTag = (mdCode: string) : string  => mdCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim()
// const removeStyleTag = (mdCode: string) : string  => mdCode.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").trim()

// const processMdFiles = async (dirName: string) :Promise<string> => {
// 	let mdFilesList = await getFileList("T:/GitHub/vitepress-plugin-search/demo/docs")
// 	let allData = ""
	
// 	for (let index = 0; index < mdFilesList.length; index++) {
// 		const mdFile = mdFilesList[index];
// 		console.log(`############################# computing ${index +1} of ${mdFilesList.length}`);
// 		let code: string = await fs.readFile(mdFile, { encoding: 'utf8' })
// 		let cleanCode = removeStyleTag(removeScriptTag(code))
// 		console.log("T = ", cleanCode);
// 		allData+= cleanCode
// 		console.log(`############################# finished ${index +1} of ${mdFilesList.length}`);
// 	}

// 	return Promise.resolve(allData)
// }

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

		// config: () => ({
		// 	resolve: {
		// 		alias: {
		// 			'./VPNavBarSearch.vue': 'vitepress-plugin-search/dist/Search.vue'
		// 		}
		// 	}
		// }),

		// transform(src, id) {						
		// 	if(id.includes('VPNavBarSearch.vue'))
		// 		return {
		// 		code: src.replace("./VPNavBarSearch.vue", "@emersonbottero/vite-plugin-search/dist/client/VPNavBarSearch.vue" ),
		// 		map: null,
		// 		};
		//   },

		async resolveId(id) {
			if (id === virtualModuleId) {
				console.log("returning an specific Id") 
				return resolvedVirtualModuleId;
			}
		},
		async load(this,id, options) {
			if (id === resolvedVirtualModuleId) {
				console.log("\ncan we wait a lot in here to then return??");
				//let allData = 'message from virtual'
				let worked = await IndexSearch(config.outDir)
				console.log(worked);
				

				//allData = await processMdFiles("future path do docs")
				
				//console.log("\ndone computing files..");
				return worked
				 return `export const msg = "just testing for now.. "`;
			}
		},
	
	};
}

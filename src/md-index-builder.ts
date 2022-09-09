const path = require('path');
const fs = require('fs/promises');
import lunr from './lunr-esm.js';
const { readdir } = require('fs').promises;

const SEARCH_FIELDS = ['body', 'anchor'];
const MAX_PREVIEW_CHARS = 62; // Number of characters to show for a given search result
const OUTPUT_INDEX_DEV = 'lunr_index.js'; // Index file

/**
 * Get a list of all md files in the docs folders.. 
 * @param dirName the full path name containing the md files
 * @returns a list of full path location of each md file
 */
const getFileList = async (dirName: string): Promise<string[]> => {
    let files = [] as string[];
    const items = await readdir(dirName, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            files = [
                ...files,
                ...(await getFileList(`${dirName}/${item.name}`)),
            ];
        } else {
			if(item.name.endsWith(".md"))
            	files.push(`${dirName}/${item.name}`);
        }
    }

    return files;
};

/**
 * remove script tags from md content
 * @param mdCode the content of md files
 * @returns the content without script tags
 */
const removeScriptTag = (mdCode: string) : string  => mdCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim()

/**
 * remove style tags from md content
 * @param mdCode the content of md files
 * @returns the content without style tags
 */const removeStyleTag = (mdCode: string) : string  => mdCode.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").trim()


 interface mdFiles {
	path: string,
	content: string
 }

 /**
  * create index docs to be used later on lunr
  * @param dirName the full path name containing the md files
  * @returns a list cleaned md contents
  */
const processMdFiles = async (dirName: string) :Promise<mdFiles[]> => {
	let mdFilesList = await getFileList("T:/GitHub/vitepress-plugin-search/demo/docs")
	let allData = [] as mdFiles[]
	
	for (let index = 0; index < mdFilesList.length; index++) {
		const mdFile = mdFilesList[index];
		console.log(`############################# computing ${index +1} of ${mdFilesList.length}`);
		let code: string = await fs.readFile(mdFile, { encoding: 'utf8' })
		let cleanCode = removeStyleTag(removeScriptTag(code))
		console.log(cleanCode);
		allData.push({content:cleanCode, path: mdFile})
		console.log(`############################# finished ${index +1} of ${mdFilesList.length}`);
	}

	return Promise.resolve(allData)
}

/**
 * index data extracted from md to be used to generate the final index and previews
 */
interface MdIndexDoc {
	path: string
	anchor: string,
	content: string
}

/**
 * Split an md content by anchors in several index docs
 * @param mdCode an md content
 * @param path path of md file
 * @returns array of index docs
 */
const parseMdContent = (mdCode: string, path: string): MdIndexDoc[]  => {
	const result = mdCode.split(/(^|\s)#{2}\s/gi);
	const cleaning = result.filter(i => i != "" && i != "\n")
	const mdData = cleaning.map(i => {
		let content = i.split("\n")
		let	anchor = content?.shift() || ""
		return { anchor, content: content.join("\n") , path}
	})
	return mdData
}

interface Doc {
	id: string; link: string; b: string; a: string
}

const buildDocs = (mdDoc: MdIndexDoc, id: string) : Doc => {
	return {
		id,
		link: mdDoc.path,
		b: mdDoc.content,
		a: mdDoc.anchor
	}
}

const buildIndex = (docs: any[]) => {
	const idx = lunr((x: any) => {
		x.ref('id');
		for (let i = 0; i < SEARCH_FIELDS.length; i++) {
			x.field(SEARCH_FIELDS[i].slice(0, 1));
		}
		docs.forEach(function (doc: any) {
			x.add(doc);
		}, x);
	});
	return idx;
};

function buildPreviews(docs: any[]) {
	const result: any = {};
	for (let i = 0; i < docs.length; i++) {
		const doc = docs[i];
		// console.log(doc);
		let preview = doc['b'];
		if (preview == '') preview = doc['b'];
		if (preview.length > MAX_PREVIEW_CHARS) preview = preview.slice(0, MAX_PREVIEW_CHARS) + ' ...';
		result[doc['id']] = {
			t: doc['a'],
			p: preview,
			l: doc['link'],
			a: doc['a']//.toLowerCase().Split(" ").join("-")
		};
	}
	return result;
}

export async function IndexSearch(HTML_FOLDER: string): Promise<string> {
	console.log('indexing...');
	const files = await processMdFiles(HTML_FOLDER);

	const docs = [] as Doc[];
	console.log('Building index for these files:');	
	if (files !== undefined) {
		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			let mdDocs = parseMdContent(file.content, file.path)			
			for (let index = 0; index < mdDocs.length; index++) {
				const mdDoc = mdDocs[index];
				docs.push(buildDocs(mdDoc, i + "." + index))
			}
		}
	}
	const idx = buildIndex(docs);
	const previews = buildPreviews(docs);
	const js: string =
		'const LUNR_DATA = ' +
		JSON.stringify(idx) +
		';\n' +
		'const PREVIEW_LOOKUP = ' +
		JSON.stringify(previews) +
		';' +
		'\n' +
		'const data = { LUNR_DATA, PREVIEW_LOOKUP };\n' +
		'export default data;';
	return js
	// fs.writeFile(path.join(HTML_FOLDER, OUTPUT_INDEX_DEV), js, function (err: string) {
	// 	if (err) {
	// 		return console.log(err);
	// 	}
	// 	console.log('Dev Index saved as ' + OUTPUT_INDEX_DEV);
	// });
}

const path = require('path');
const fs = require('fs');
import lunr from './lunr-esm.js';
const cheerio = require('cheerio');

const SEARCH_FIELDS = ['title', 'description', 'keywords', 'body', 'anchor'];
const EXCLUDE_FILES = ['search.html'];
const MAX_PREVIEW_CHARS = 62; // Number of characters to show for a given search result
const OUTPUT_INDEX_DEV = 'lunr_index.js'; // Index file

function isHtml(filename: string): boolean {
	const lower = filename.toLowerCase();
	return lower.endsWith('.htm') || lower.endsWith('.html');
}

function findHtml(folder: string): string[] | undefined {
	if (!fs.existsSync(folder)) {
		console.log('Could not find folder: ', folder);
		return undefined;
	}

	const files = fs.readdirSync(folder);
	let htmlList: string[] = [];
	for (let i = 0; i < files.length; i++) {
		const filename: string = path.join(folder, files[i]);
		const stat = fs.lstatSync(filename);
		if (stat.isDirectory()) {
			const recursed = findHtml(filename);
			if (recursed) {
				for (let j = 0; j < recursed?.length; j++) {
					recursed[j] = path.join(files[i], recursed[j]).replace(/\\/g, '/');
				}
				htmlList = [...htmlList, ...recursed];
			}
		} else if (isHtml(filename) && !EXCLUDE_FILES.includes(files[i])) {
			htmlList.push(files[i]);
		}
	}
	return htmlList;
}

interface doc {
	id: string; link: string; t: string; d: string; k: string; b: string; a: string
}

function readHtml(
	root: string,
	file: string,
	fileId: string
): doc {
	const filename = path.join(root, file);
	const txt = fs.readFileSync(filename).toString();
	//TODO: split content by anchors and create a doc for each
	const $ = cheerio.load(txt);
	let title: string = $('title').text();
	if (typeof title == 'undefined') title = file;
	let description: string = $('meta[name=description]').attr('content');
	if (typeof description == 'undefined') description = '';
	let keywords: string = $('meta[name=keywords]').attr('content');
	if (typeof keywords == 'undefined') keywords = '';
	let body: string = $('.container').text();
	if (typeof body == 'undefined') body = '';
	let anchor: string = $('.header-anchor').attr('href');
	if (typeof anchor == 'undefined') anchor = '';
	const data = {
		id: fileId,
		link: file,
		t: title,
		d: description,
		k: keywords,
		b: body,
		a: anchor
	};
	return data;
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
			t: doc['t'],
			p: preview,
			l: doc['link'],
			a: doc['a']
		};
	}
	return result;
}

export function IndexSearch(HTML_FOLDER: string) {
	console.log('indexing...');
	console.log(process.argv0);
	const files = findHtml(HTML_FOLDER);

	const docs = [] as doc[];
	console.log('Building index for these files:');
	if (files !== undefined) {
		for (let i = 0; i < files.length; i++) {
			docs.push(readHtml(HTML_FOLDER, files[i], i.toString()));
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
	fs.writeFile(path.join(HTML_FOLDER, OUTPUT_INDEX_DEV), js, function (err: string) {
		if (err) {
			return console.log(err);
		}
		console.log('Dev Index saved as ' + OUTPUT_INDEX_DEV);
	});
}

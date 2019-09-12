/*
 * Copyright 2010-2019 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * This file is part of SingleFile.
 *
 *   The code in this file is free software: you can redistribute it and/or 
 *   modify it under the terms of the GNU Affero General Public License 
 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
 *   of the License, or (at your option) any later version.
 * 
 *   The code in this file is distributed in the hope that it will be useful, 
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
 *   General Public License for more details.
 *
 *   As additional permission under GNU AGPL version 3 section 7, you may 
 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
 *   AGPL normally required by section 4, provided you include this license 
 *   notice and a URL through which recipients can access the Corresponding 
 *   Source.
 */

/* global require, exports */

const fs = require("fs");

const SCRIPTS = [
	"/lib/hooks/content/content-hooks.js",
	"/lib/hooks/content/content-hooks-frames.js",
	"/lib/frame-tree/content/content-frame-tree.js",
	"/lib/lazy/content/content-lazy-loader.js",
	"/lib/single-file/single-file-util.js",
	"/lib/single-file/single-file-helper.js",
	"/lib/single-file/vendor/css-tree.js",
	"/lib/single-file/vendor/html-srcset-parser.js",
	"/lib/single-file/vendor/css-minifier.js",
	"/lib/single-file/vendor/css-font-property-parser.js",
	"/lib/single-file/vendor/css-media-query-parser.js",
	"/lib/single-file/modules/html-minifier.js",
	"/lib/single-file/modules/css-fonts-minifier.js",
	"/lib/single-file/modules/css-fonts-alt-minifier.js",
	"/lib/single-file/modules/css-matched-rules.js",
	"/lib/single-file/modules/css-medias-alt-minifier.js",
	"/lib/single-file/modules/css-rules-minifier.js",
	"/lib/single-file/modules/html-images-alt-minifier.js",
	"/lib/single-file/modules/html-serializer.js",
	"/lib/single-file/single-file-core.js",
	"/lib/single-file/single-file.js",
	"/common/ui/content/content-infobar.js"
];

const INDEX_SCRIPTS = [
	"/lib/index.js",
	"/common/index.js"
];

const WEB_SCRIPTS = [
	"/lib/hooks/content/content-hooks-web.js",
	"/lib/hooks/content/content-hooks-frames-web.js",
	"/common/ui/content/content-infobar-web.js"
];

exports.get = async options => {
	let scripts = await readFiles(INDEX_SCRIPTS);
	const webScripts = {};
	[
		webScripts["/lib/hooks/content/content-hooks-web.js"],
		webScripts["/lib/hooks/content/content-hooks-frames-web.js"],
		webScripts["/common/ui/content/content-infobar-web.js"]
	] = await Promise.all(WEB_SCRIPTS.map(path => readScriptFile(path)));
	scripts += "this.singlefile.lib.getFileContent = filename => (" + JSON.stringify(webScripts) + ")[filename];\n";
	scripts += await readFiles(SCRIPTS);
	scripts += await readFiles(options.browserScripts);
	return scripts;
};

async function readFiles(paths, basePath) {
	return (await Promise.all(paths.map(path => readScriptFile(path, basePath)))).join("");
}

function readScriptFile(path, basePath = "../../..") {
	return new Promise((resolve, reject) =>
		fs.readFile(require.resolve(basePath + path), (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data.toString() + "\n");
			}
		})
	);
}
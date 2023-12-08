import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads the content of a folder and the folders within it.
 * @param dir The directory from which the files will be read.
 * @returns An array of file paths.
 */
export default function (dir: string) {
	const files = readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => join(dir, entry.name));
	const folders = readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => join(dir, entry.name));

	if (folders.length == 0) return files;

	folders.forEach((folder) => {
		const children = readdirSync(folder, { withFileTypes: true })
			.filter((entry) => entry.isFile())
			.map((entry) => entry.name);
		files.concat(children);
	});

	return files;
}

import { createGunzip } from "node:zlib";
import { pipeline } from "node:stream";
import { createReadStream, createWriteStream, unlinkSync } from "node:fs";
import { promisify } from "node:util";
import archiver from "archiver";
import { basename } from "node:path";

const pipe = promisify(pipeline);

/**
 * Compresses a specified file.
 * The original gets deleted.
 * @param input The path of the input.
 */
export async function compress(input: string) {
	if (input.includes(".gz")) return;

	const zipper = archiver("tar", {
		gzip: true,
		zlib: { level: 9 }
	});
	zipper.pipe(createWriteStream(input));

	zipper.file(input, { name: basename(input) });

	await zipper.finalize();

	unlinkSync(input);
}

/**
 * Decompresses a specified file.
 * The original gets deleted.
 * @param input The path of the input.
 */
export async function uncompress(input: string) {
	if (!input.includes(".gz")) return;

	const gunzip = createGunzip();
	const source = createReadStream(input);

	const dest = input.split(".gz")[0];
	const destination = createWriteStream(dest);

	await pipe(source, gunzip, destination);

	unlinkSync(input);
}

/**
 * Compress several files into one archive and
 * deletes the original files.
 * @param files The files to be compressed.
 * @param path The path of the archive. Should be a `tar.gz` file.
 */
export async function archive(files: string[], path: string) {
	const zipper = archiver("tar", {
		gzip: true,
		zlib: { level: 9 }
	});
	zipper.pipe(createWriteStream(path));

	files.forEach((file) => {
		if (file.includes(".gz")) {
			uncompress(file);
			file = file.split(".gz")[0];
		}

		zipper.file(file, { name: basename(file) });
	});

	await zipper.finalize();

	files.forEach((file) => {
		unlinkSync(file);
	});
}

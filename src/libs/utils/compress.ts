import { createWriteStream, unlinkSync } from "node:fs";
import archiver from "archiver";
import { basename } from "node:path";

/**
 * Compress several files into one archive and
 * deletes the original files.
 * @param destination The path of the compressed archive. Should be a `.tar.gz` file.
 * @param files The files to be compressed.
 */
export default async function compress(
	destination: string,
	...files: string[]
) {
	const zipper = archiver("tar", {
		gzip: true,
		zlib: { level: 9 }
	});

	if (destination.endsWith(".tar.gz")) {
		zipper.pipe(createWriteStream(destination));
	} else {
		zipper.pipe(createWriteStream(`${destination}.tar.gz`));
	}

	const archiveFiles = files.filter((file) => !file.endsWith(".tar.gz"));

	archiveFiles.forEach((file) => {
		zipper.file(file, { name: basename(file) });
	});

	await zipper.finalize();

	archiveFiles.forEach((file) => {
		unlinkSync(file);
	});
}

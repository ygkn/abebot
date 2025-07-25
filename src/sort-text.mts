import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const appDirname = join(dirname(new URL(import.meta.url).pathname), "..");

await Promise.all(
	["abe.txt", "triggers.txt"].map(async (filename) => {
		const path = join(appDirname, filename);

		await writeFile(
			path,
			[
				...(await readFile(path))
					.toString()
					.split("\n")
					.map((row) => row.trim())
					.filter((row) => row)
					.sort(),
				"",
			].join("\n"),
		);
	}),
);

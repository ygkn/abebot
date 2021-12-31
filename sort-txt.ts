import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.78.0/path/mod.ts";

const cwd = dirname(fromFileUrl(import.meta.url));

Promise.all(["abe.txt", "triggers.txt"].map(async (filename) => {
  const path = join(cwd, filename);

  await Deno.writeTextFile(
    path,
    [
      ...(await Deno.readTextFile(path))
        .split("\n")
        .map((row) => row.trim().toLowerCase())
        .filter((row) => row)
        .sort(),
      "",
    ]
      .join("\n"),
  );
}));

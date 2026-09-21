import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import subsetFont from "subset-font";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFont = path.join(
  projectRoot,
  "node_modules/@fontsource/lxgw-wenkai/files/lxgw-wenkai-latin-500-normal.woff2"
);
const outputFont = path.join(projectRoot, "public/fonts/lxgw-wenkai-ui.woff2");
const fontLicense = path.join(projectRoot, "node_modules/@fontsource/lxgw-wenkai/LICENSE");
const outputLicense = path.join(projectRoot, "public/fonts/OFL-LXGW-WenKai.txt");
const sourceExtensions = new Set([".css", ".ts", ".tsx"]);
const sourceRoots = [path.join(projectRoot, "src"), path.join(projectRoot, "tests/fixtures")];

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectSourceFiles(entryPath)));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(entryPath);
  }
  return files;
}

const sourceFiles = (await Promise.all(sourceRoots.map(collectSourceFiles))).flat();
const sourceText = (await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))).join(
  "\n"
);
const requiredText = [
  sourceText,
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  "，。！？；：、（）《》〈〉【】“”‘’—…·#@&%+-=/_."
].join("");
const glyphs = [...new Set([...requiredText].filter((character) => !/\p{C}/u.test(character)))]
  .sort()
  .join("");

const input = await readFile(sourceFont);
const output = await subsetFont(input, glyphs, {
  targetFormat: "woff2",
  noHinting: true
});

await mkdir(path.dirname(outputFont), { recursive: true });
await writeFile(outputFont, output);
await copyFile(fontLicense, outputLicense);
console.info(
  `霞鹜文楷子集：${glyphs.length} 个字符，${Math.round(input.byteLength / 1024)} KiB → ${Math.round(output.byteLength / 1024)} KiB (${path.relative(projectRoot, outputFont)})`
);

if (output.byteLength > 512 * 1024) {
  console.error("霞鹜文楷 UI 子集超过 512 KiB，请检查是否误把大文件加入字符收集范围");
  process.exitCode = 1;
}

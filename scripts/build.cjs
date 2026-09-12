const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");
const vendor = path.join(root, "vendor");
execFileSync(process.execPath, [path.join(__dirname, "build-icons.cjs")], { stdio: "inherit" });
const fontPackage = path.dirname(require.resolve("@fontsource-variable/manrope/package.json"));
fs.copyFileSync(
  path.join(fontPackage, "files/manrope-latin-wght-normal.woff2"),
  path.join(vendor, "manrope-latin-wght-normal.woff2"),
);
fs.copyFileSync(path.join(fontPackage, "LICENSE"), path.join(vendor, "manrope-LICENSE"));
fs.mkdirSync(output, { recursive: true });
for (const file of ["index.html", "app.js", "interface.js", "styles.css"]) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
const outputVendor = path.join(output, "vendor");
fs.mkdirSync(outputVendor, { recursive: true });
for (const file of fs.readdirSync(vendor)) {
  if (fs.statSync(path.join(vendor, file)).isFile())
    fs.copyFileSync(path.join(vendor, file), path.join(outputVendor, file));
}
const html = fs.readFileSync(path.join(output, "index.html"), "utf8");
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const target = match[1];
  if (/^(data:|https?:)/.test(target)) continue;
  if (!fs.existsSync(path.join(output, target))) throw new Error(`Missing asset: ${target}`);
}
console.log("Static offline build ready in dist/.");

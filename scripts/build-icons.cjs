const fs = require("node:fs");
const path = require("node:path");
const lucide = require("lucide");

const names = ["ChevronLeft", "ChevronRight", "CalendarDays", "Plus", "DatabaseBackup", "Download", "Upload", "FileText", "FilterX", "Copy", "Undo2", "Pencil", "Trash2", "LayoutDashboard", "List", "ChartPie", "Settings", "ArrowUpRight", "ArrowDownRight"];
const nodes = Object.fromEntries(names.map((name) => [name, lucide[name]]));
const output = `// Generated from Lucide. See lucide-LICENSE.\nconst bolsarioIconNodes = ${JSON.stringify(nodes)};\nfunction icon(name) {\n  const nodes = bolsarioIconNodes[name] || [];\n  return '<svg class="lucide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + nodes.map(([tag, attrs]) => '<' + tag + ' ' + Object.entries(attrs).map(([key, value]) => key + '=\"' + value + '\"').join(' ') + '></' + tag + '>').join('') + '</svg>';\n}\nfunction renderIcons() {\n  document.querySelectorAll('[data-icon]').forEach((element) => { element.innerHTML = icon(element.dataset.icon); });\n}\n`;
const directory = path.join(__dirname, "..", "vendor");
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(directory, "icons.js"), output);
fs.copyFileSync(path.join(path.dirname(require.resolve("lucide/package.json")), "LICENSE"), path.join(directory, "lucide-LICENSE"));

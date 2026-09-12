const fs = require("node:fs");
const path = require("node:path");
const lucide = require("lucide");

const names = [
  "ChevronLeft",
  "ChevronRight",
  "ChevronDown",
  "CalendarDays",
  "Plus",
  "DatabaseBackup",
  "Download",
  "Upload",
  "FileText",
  "FilterX",
  "Copy",
  "Undo2",
  "Pencil",
  "Trash2",
  "LayoutDashboard",
  "List",
  "ChartPie",
  "Settings",
  "ArrowUpRight",
  "ArrowDownRight",
  "FolderOpen",
  "Search",
  "SlidersHorizontal",
  "X",
  "Check",
  "Archive",
  "ChartNoAxesColumn",
  "Home",
  "ShoppingBasket",
  "Car",
  "Heart",
  "BookOpen",
  "Ticket",
  "Repeat",
  "Pause",
  "Play",
  "TriangleAlert",
  "BriefcaseBusiness",
  "Puzzle",
  "Tag",
  "TrendingUp",
  "Circle",
];
for (const name of names) {
  if (!lucide[name]) throw new Error(`Missing Lucide icon: ${name}`);
}
const nodes = Object.fromEntries(names.map((name) => [name, lucide[name]]));
const output = `// Generated from Lucide. See lucide-LICENSE.
const bolsarioIconNodes = ${JSON.stringify(nodes)};
function icon(name) {
  const nodes = bolsarioIconNodes[name] || [];
  return '<svg class="lucide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + nodes.map(([tag, attrs]) => '<' + tag + ' ' + Object.entries(attrs).map(([key, value]) => key + '="' + value + '"').join(' ') + '></' + tag + '>').join('') + '</svg>';
}
function renderIcons() {
  document.querySelectorAll('[data-icon]').forEach((element) => { element.innerHTML = icon(element.dataset.icon); });
}
`;
const directory = path.join(__dirname, "..", "vendor");
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(directory, "icons.js"), output);
fs.copyFileSync(
  path.join(path.dirname(require.resolve("lucide/package.json")), "LICENSE"),
  path.join(directory, "lucide-LICENSE"),
);

// Backward-compatible entry point for the former standalone browser checks.
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const packagePath = require.resolve("playwright/package.json");
const cli = path.join(path.dirname(packagePath), require(packagePath).bin.playwright);
const result = spawnSync(process.execPath, [cli, "test", ...process.argv.slice(2)], {
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;

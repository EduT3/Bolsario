import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["vendor/**", "dist/**", "artifacts/**", "playwright-report/**", "test-results/**"] },
  js.configs.recommended,
  {
    files: ["*.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,
        icon: "readonly",
        renderIcons: "readonly",
        BolsarioUI: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^BolsarioUI$" }],
    },
  },
  { files: ["**/*.cjs", "**/*.mjs"], languageOptions: { globals: globals.node } },
  { files: ["interface.js"], languageOptions: { globals: { BolsarioUI: "off" } } },
  {
    files: ["tests/**/*.cjs"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
];

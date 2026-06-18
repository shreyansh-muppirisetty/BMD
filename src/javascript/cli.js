#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { render } from "./bmd.js";

const [, , input, output, ...rest] = process.argv;

const helpMessage = `Beautiful Markdown CLI

Usage:
  bmd <input.bmd|input.md> <output.html> [options]

Options:
  --theme <path>    Load custom theme from JSON file (can be used multiple times)
  -h, --help        Show this help message

Examples:
  bmd article.bmd article.html
  bmd article.bmd article.html --theme ./theme.json
  bmd article.bmd article.html --theme theme1.json --theme theme2.json
`;

if (input === "-h" || input === "--help" || input === "help") {
  console.log(helpMessage);
  process.exit(0);
}

if (!input || !output) {
  console.error("Usage: bmd <input.bmd|input.md> <output.html> [--theme path/to/theme.json]");
  console.error("Use 'bmd --help' for more information");
  process.exit(1);
}

const customThemes = [];
for (let i = 0; i < rest.length; i += 1) {
  if (rest[i] === "--theme" && rest[i + 1]) {
    customThemes.push(rest[i + 1]);
    i += 1;
  }
}

const source = readFileSync(input, "utf8");
const html = render(source, { customThemes });
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, html);
console.log(`Rendered ${input} -> ${output}`);

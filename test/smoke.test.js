import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse, render } from "../src/bmd.js";

const source = readFileSync("examples/showcase.bmd", "utf8");
const ast = parse(source);
const html = render(source);

assert.equal(ast.type, "BmdDocument");
assert.equal(ast.metadata.theme, "modern");
assert.equal(ast.theme.tokens.accent, "#dc2626");
assert.match(html, /<!doctype html>/);
assert.match(html, /<article class="bmd-content">/);
assert.match(html, /<table>/);
assert.match(html, /<pre><code class="language-js">/);
assert.match(html, /<aside>/);

const plain = render("# Plain\n\nA **simple** Markdown file.");
assert.match(plain, /<h1>Plain<\/h1>/);
assert.match(plain, /<strong>simple<\/strong>/);

const components = render(":::warning\nCareful\n:::\n\n[button outline-primary] Learn");
assert.match(components, /bmd-alert bmd-alert-warning/);
assert.match(components, /bmd-btn bmd-btn-outline-primary/);

console.log("BMD smoke tests passed.");

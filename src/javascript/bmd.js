import { readFileSync } from "node:fs";
import { resolveTheme, builtInThemes } from "./themes.js";
import { baseCss } from "./styles.js";

export function tokenize(source) {
  const normalized = source.replace(/\r\n?/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return {
      type: "BmdTokens",
      frontmatter: "",
      markdown: normalized
    };
  }

  const close = normalized.indexOf("\n---\n", 4);
  if (close === -1) {
    return {
      type: "BmdTokens",
      frontmatter: "",
      markdown: normalized
    };
  }

  return {
    type: "BmdTokens",
    frontmatter: normalized.slice(4, close),
    markdown: normalized.slice(close + 5)
  };
}

export function parseFrontmatter(frontmatter) {
  const metadata = {};
  for (const line of frontmatter.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!match) continue;
    metadata[match[1]] = parseScalar(match[2]);
  }
  return metadata;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

export function parse(source, options = {}) {
  const tokens = tokenize(source);
  const metadata = parseFrontmatter(tokens.frontmatter);
  const customThemes = loadCustomThemes(options.customThemes || []);
  const theme = resolveTheme(metadata, customThemes);

  return {
    type: "BmdDocument",
    version: "0.1",
    metadata,
    theme,
    children: parseMarkdownBlocks(tokens.markdown)
  };
}

function loadCustomThemes(paths) {
  return paths.map((path) => JSON.parse(readFileSync(path, "utf8")));
}

export function render(source, options = {}) {
  const ast = parse(source, options);
  return renderDocument(ast);
}

function getDebugCss() {
  return `
.bmd-debug-panel {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  max-width: 500px;
  height: 400px;
  background: #1e1e1e;
  border: 2px solid #007acc;
  border-radius: 8px;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #d4d4d4;
  margin: 16px;
}

.bmd-debug-panel.hidden {
  display: none;
}

.bmd-debug-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #007acc;
  background: #252526;
  gap: 12px;
}

.bmd-debug-header h2 {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}

.bmd-debug-close {
  background: none;
  border: none;
  color: #d4d4d4;
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}

.bmd-debug-close:hover {
  color: #fff;
  transform: scale(1.1);
}

.bmd-debug-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.bmd-debug-item {
  margin-bottom: 16px;
  border-bottom: 1px solid #333;
  padding-bottom: 12px;
}

.bmd-debug-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.bmd-debug-label {
  display: block;
  margin-bottom: 4px;
  color: #4fc1ff;
  font-weight: bold;
}

.bmd-debug-input {
  width: 100%;
  padding: 6px;
  background: #1e1e1e;
  border: 1px solid #555;
  color: #d4d4d4;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  box-sizing: border-box;
}

.bmd-debug-input:focus {
  outline: none;
  border-color: #007acc;
}

.bmd-debug-theme-select:focus {
  outline: none;
  border-color: #007acc;
}
`;
}

function getDebugScript() {
  return `
const debugPanel = document.querySelector('.bmd-debug-panel');
const debugClose = document.querySelector('.bmd-debug-close');
const debugContent = document.querySelector('.bmd-debug-content');
const themeSelect = document.querySelector('.bmd-debug-theme-select');

function renderDebugPanel() {
  const tokens = JSON.parse(debugPanel.getAttribute('data-bmd-theme'));
  debugContent.innerHTML = '';
  
  for (const [key, value] of Object.entries(tokens)) {
    const item = document.createElement('div');
    item.className = 'bmd-debug-item';
    item.innerHTML = \`
      <label class="bmd-debug-label">\${key}</label>
      <input type="text" class="bmd-debug-input" value="\${String(value).replace(/"/g, '&quot;')}" data-token="\${key}">
    \`;
    
    const input = item.querySelector('.bmd-debug-input');
    input.addEventListener('change', (e) => {
      const cssVar = '--bmd-' + key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
      document.documentElement.style.setProperty(cssVar, e.target.value);
    });
    
    debugContent.appendChild(item);
  }
}

function initThemeSelector() {
  const themes = JSON.parse(debugPanel.getAttribute('data-bmd-themes'));
  const currentTheme = debugPanel.getAttribute('data-bmd-current');
  
  for (const [key, theme] of Object.entries(themes)) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = theme.name;
    if (key === currentTheme) option.selected = true;
    themeSelect.appendChild(option);
  }
  
  themeSelect.addEventListener('change', (e) => {
    if (!e.target.value) return;
    const themes = JSON.parse(debugPanel.getAttribute('data-bmd-themes'));
    const selectedTheme = themes[e.target.value];
    
    if (selectedTheme && selectedTheme.tokens) {
      debugPanel.setAttribute('data-bmd-theme', JSON.stringify(selectedTheme.tokens));
      for (const [key, value] of Object.entries(selectedTheme.tokens)) {
        const cssVar = '--bmd-' + key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
        document.documentElement.style.setProperty(cssVar, value);
      }
      renderDebugPanel();
    }
  });
}

initThemeSelector();
renderDebugPanel();

debugClose.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  debugPanel.setAttribute('hidden', '');
});

let periodHoldTimer = null;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    e.preventDefault();
    debugPanel.setAttribute('hidden', '');
  }
  if (e.code === 'Period' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
    if (!periodHoldTimer) {
      periodHoldTimer = setTimeout(() => {
        debugPanel.toggleAttribute('hidden');
        periodHoldTimer = null;
      }, 800);
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Period' && periodHoldTimer) {
    clearTimeout(periodHoldTimer);
    periodHoldTimer = null;
  }
});
`;
}

export function renderDocument(ast) {
  const title = escapeHtml(ast.metadata.title || findFirstHeading(ast.children) || "Beautiful Markdown");
  const description = ast.metadata.description
    ? `<meta name="description" content="${escapeAttribute(ast.metadata.description)}">\n    `
    : "";
  const body = ast.children.map(renderNode).join("\n");
  const isDebugMode = ast.metadata.debug === true;
  const themeTokensJson = JSON.stringify(ast.theme.tokens).replace(/"/g, '&quot;');
  const builtInThemesList = JSON.stringify(Object.entries(builtInThemes).map(([key, val]) => ({ name: key, displayName: val.name })));
  const builtInThemesJson = JSON.stringify(builtInThemes).replace(/"/g, '&quot;');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${description}<title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>
${baseCss(ast.theme)}
${isDebugMode ? getDebugCss() : ''}
    </style>
  </head>
  <body class="bmd-theme-${escapeAttribute(ast.theme.name)}">
    <main class="bmd-document">
      <article class="bmd-content">
${indent(body, 8)}
      </article>
    </main>
    ${ast.metadata.readingProgress ? '<div class="bmd-reading-progress" aria-hidden="true"><div></div></div>' : ''}
    ${isDebugMode ? `<div class="bmd-debug-panel" data-bmd-theme="${themeTokensJson}" data-bmd-themes="${builtInThemesJson}" data-bmd-current="${ast.theme.name}"><div class="bmd-debug-header"><div style="flex: 1;"><h2>Debug Mode</h2><select class="bmd-debug-theme-select" style="margin-top: 8px; width: 100%; padding: 6px; background: #1e1e1e; border: 1px solid #555; color: #d4d4d4; font-family: 'Courier New', monospace; font-size: 12px;"><option value="">-- Select Theme --</option></select></div><button class="bmd-debug-close">&times;</button></div><div class="bmd-debug-content"></div></div>` : ''}
    <script>
      const progress = document.querySelector('.bmd-reading-progress > div');
      const updateProgress = () => {
        if (!progress) return;
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.width = (max <= 0 ? 100 : Math.min(100, Math.max(0, scrollY / max * 100))) + '%';
      };
      addEventListener('scroll', updateProgress, { passive: true });
      addEventListener('resize', updateProgress);
      updateProgress();
      document.addEventListener('click', (event) => {
        const toggle = event.target.closest('[data-bmd-toggle]');
        if (!toggle) return;
        const target = document.querySelector(toggle.getAttribute('data-bmd-target'));
        if (!target) return;
        if (toggle.dataset.bmdToggle === 'tab') {
          const root = toggle.closest('[data-bmd-tabs]');
          root.querySelectorAll('[role="tab"]').forEach((tab) => tab.setAttribute('aria-selected', 'false'));
          root.querySelectorAll('[role="tabpanel"]').forEach((pane) => pane.hidden = true);
          toggle.setAttribute('aria-selected', 'true');
          target.hidden = false;
        } else {
          const open = target.hasAttribute('hidden');
          target.toggleAttribute('hidden', !open);
          toggle.setAttribute('aria-expanded', String(open));
        }
      });
      ${isDebugMode ? getDebugScript() : ''}
    </script>
  </body>
</html>
`;
}

function parseMarkdownBlocks(markdown) {
  const lines = markdown.split("\n");
  const nodes = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const directive = line.match(/^:::\s*([A-Za-z][\w-]*)(.*)$/);
    if (directive) {
      const body = [];
      let depth = 1;
      i += 1;
      while (i < lines.length && depth > 0) {
        if (/^:::\s*[A-Za-z]/.test(lines[i])) depth += 1;
        if (/^:::\s*$/.test(lines[i])) {
          depth -= 1;
          if (depth === 0) break;
        }
        body.push(lines[i]);
        i += 1;
      }
      i += 1;
      nodes.push({
        type: "directive",
        name: directive[1],
        args: directive[2].trim().split(/\s+/).filter(Boolean),
        children: parseDirectiveBody(directive[1], body.join("\n"))
      });
      continue;
    }

    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const code = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      nodes.push({ type: "code", lang: fence[1] || "", value: code.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      nodes.push({ type: "heading", depth: heading[1].length, children: parseInlines(heading[2]) });
      i += 1;
      continue;
    }

    if (/^ {0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      nodes.push({ type: "thematicBreak" });
      i += 1;
      continue;
    }

    if (/^\s*\|.+\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i + 1])) {
      const tableLines = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && /^\s*\|.+\|\s*$/.test(lines[i])) {
        tableLines.push(lines[i]);
        i += 1;
      }
      nodes.push(parseTable(tableLines));
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      nodes.push({ type: "blockquote", children: parseMarkdownBlocks(quote.join("\n")) });
      continue;
    }

    if (/^\s*([-+*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      while (i < lines.length && (ordered ? /^\s*\d+\.\s+/.test(lines[i]) : /^\s*[-+*]\s+/.test(lines[i]))) {
        items.push({
          type: "listItem",
          children: [{ type: "paragraph", children: parseInlines(lines[i].replace(/^\s*([-+*]|\d+\.)\s+/, "")) }]
        });
        i += 1;
      }
      nodes.push({ type: "list", ordered, children: items });
      continue;
    }

    if (/^\s*</.test(line)) {
      const html = [];
      while (i < lines.length && lines[i].trim()) {
        html.push(lines[i]);
        i += 1;
      }
      nodes.push({ type: "html", value: html.join("\n") });
      continue;
    }

    const paragraph = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(#{1,6})\s+/.test(lines[i]) && !/^```/.test(lines[i]) && !/^:::\s*/.test(lines[i])) {
      paragraph.push(lines[i]);
      i += 1;
    }
    nodes.push({ type: "paragraph", children: parseInlines(paragraph.join(" ")) });
  }

  return nodes;
}

function parseTable(lines) {
  const rows = lines.map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));
  return {
    type: "table",
    header: rows[0].map((cell) => parseInlines(cell)),
    rows: rows.slice(2).map((row) => row.map((cell) => parseInlines(cell)))
  };
}

function parseDirectiveBody(name, body) {
  if (name === "accordion") return parseAccordion(body);
  if (name === "tabs") return parseTabs(body);
  return parseMarkdownBlocks(body.replace(/^style:\n(?:  .+\n?)*/m, ""));
}

function parseAccordion(body) {
  return body.split(/\n(?=\? )/).filter(Boolean).map((part) => {
    const lines = part.split("\n");
    return {
      title: lines[0].replace(/^\?\s*/, "").trim(),
      children: parseMarkdownBlocks(lines.slice(1).join("\n").trim())
    };
  });
}

function parseTabs(body) {
  return body.split(/\n(?=@tab )/).filter(Boolean).map((part) => {
    const lines = part.replace(/^@tab\s+/, "").split("\n");
    return {
      title: lines[0].trim(),
      children: parseMarkdownBlocks(lines.slice(1).join("\n").trim())
    };
  });
}

function parseInlines(text) {
  const nodes = [];
  const pattern = /(\[button [^\]]+\]\s+[^\n]+|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match;

  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push({ type: "text", value: text.slice(last, match.index) });
    nodes.push(parseInlineToken(match[0]));
    last = match.index + match[0].length;
  }

  if (last < text.length) nodes.push({ type: "text", value: text.slice(last) });
  return nodes;
}

function parseInlineToken(token) {
  let match = token.match(/^\[button ([^\]]+)\]\s+(.+)$/);
  if (match) return { type: "button", variant: match[1].trim(), label: match[2].trim() };
  match = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (match) return { type: "image", alt: match[1], url: match[2] };
  match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (match) return { type: "link", url: match[2], children: [{ type: "text", value: match[1] }] };
  if (token.startsWith("`")) return { type: "inlineCode", value: token.slice(1, -1) };
  if (token.startsWith("**")) return { type: "strong", children: parseInlines(token.slice(2, -2)) };
  if (token.startsWith("*")) return { type: "emphasis", children: parseInlines(token.slice(1, -1)) };
  return { type: "text", value: token };
}

function renderNode(node) {
  switch (node.type) {
    case "heading":
      return `<h${node.depth}>${renderInlines(node.children)}</h${node.depth}>`;
    case "paragraph":
      return `<p>${renderInlines(node.children)}</p>`;
    case "blockquote":
      return `<blockquote>\n${indent(node.children.map(renderNode).join("\n"), 2)}\n</blockquote>`;
    case "list":
      return `<${node.ordered ? "ol" : "ul"}>\n${indent(node.children.map(renderNode).join("\n"), 2)}\n</${node.ordered ? "ol" : "ul"}>`;
    case "listItem":
      return `<li>${node.children.map(renderNode).join("\n")}</li>`;
    case "table":
      return renderTable(node);
    case "code":
      return `<pre><code${node.lang ? ` class="language-${escapeAttribute(node.lang)}"` : ""}>${escapeHtml(node.value)}</code></pre>`;
    case "thematicBreak":
      return "<hr>";
    case "html":
      return node.value;
    case "directive":
      return renderDirective(node);
    default:
      return "";
  }
}

function renderDirective(node) {
  const html = Array.isArray(node.children) ? node.children.map(renderNode).join("\n") : "";
  const kind = node.name;
  const alertKinds = ["note", "tip", "info", "success", "warning", "danger"];
  if (alertKinds.includes(kind)) {
    const variant = ({ note: "secondary", tip: "primary", info: "info" })[kind] || kind;
    return `<aside class="bmd-alert bmd-alert-${variant}" role="note">${html}</aside>`;
  }
  if (kind === "card") return `<section class="bmd-card ${classes(node.args)}"><div class="bmd-card-body">${html}</div></section>`;
  if (kind === "accordion") return renderAccordion(node);
  if (kind === "tabs") return renderTabs(node);
  if (kind === "collapse") return `<details class="bmd-collapse"><summary>${escapeHtml(node.args.join(" ") || "Details")}</summary>${html}</details>`;
  if (kind === "modal") return `<section class="bmd-modal" role="dialog" aria-modal="false"><div class="bmd-modal-body">${html}</div></section>`;
  if (kind === "toast") return `<section class="bmd-toast" role="status">${html}</section>`;
  if (kind === "carousel") return `<section class="bmd-carousel" aria-label="Carousel">${html}</section>`;
  if (kind === "offcanvas") return `<aside class="bmd-offcanvas" aria-modal="false">${html}</aside>`;
  if (kind === "badge") return `<span class="bmd-badge">${plainTextFromNodes(node.children)}</span>`;
  if (kind === "breadcrumbs") return `<nav aria-label="breadcrumb"><ol class="bmd-breadcrumb">${plainTextFromNodes(node.children).split("/").map((part) => `<li>${escapeHtml(part.trim())}</li>`).join("")}</ol></nav>`;
  if (kind === "dropdown") return renderDisclosure("dropdown", node.args.join(" ") || "Menu", html);
  if (kind === "tooltip") return `<span class="bmd-tooltip" tabindex="0" data-tip="${escapeAttribute(plainTextFromNodes(node.children))}">${escapeHtml(node.args.join(" ") || "Tooltip")}</span>`;
  if (kind === "popover") return renderDisclosure("popover", node.args.join(" ") || "Popover", html);
  if (kind === "progress") return `<div class="bmd-progress" role="progressbar" aria-label="Progress" aria-valuenow="${progressValue(node)}" aria-valuemin="0" aria-valuemax="100"><div style="width: ${progressValue(node)}%">${progressValue(node)}%</div></div>`;
  if (kind === "pagination") return `<nav aria-label="Pagination"><ul class="bmd-pagination">${plainTextFromNodes(node.children).split(/\s+/).filter(Boolean).map((part, index) => `<li><button type="button"${index === 0 ? ' aria-current="page"' : ""}>${escapeHtml(part)}</button></li>`).join("")}</ul></nav>`;
  if (kind === "spinner") return `<div class="bmd-spinner" role="status"><span class="bmd-sr-only">${escapeHtml(plainTextFromNodes(node.children) || "Loading")}</span></div>`;
  if (kind === "list-group") return `<div class="bmd-list-group">${node.children.map((child) => child.type === "list" ? child.children.map((item) => `<div class="bmd-list-group-item">${item.children.map(renderNode).join("")}</div>`).join("") : `<div class="bmd-list-group-item">${renderNode(child)}</div>`).join("")}</div>`;
  if (kind === "navbar") return `<nav class="bmd-navbar" aria-label="Navigation">${plainTextFromNodes(node.children).split("|").map((part) => `<button type="button">${escapeHtml(part.trim())}</button>`).join("")}</nav>`;
  return `<section class="bmd-${escapeAttribute(kind)}">${html}</section>`;
}

function progressValue(node) {
  const match = plainTextFromNodes(node.children).match(/\d+/);
  return match ? Math.max(0, Math.min(100, Number(match[0]))) : 0;
}

function plainTextFromNodes(nodes) {
  return nodes.map((node) => {
    if (node.type === "paragraph" || node.type === "heading") return plainText(node.children);
    if (node.type === "list") return node.children.map((item) => plainTextFromNodes(item.children)).join(" ");
    return node.value || "";
  }).join(" ").trim();
}

function classes(args) {
  return args.map((arg) => `bmd-${arg}`).join(" ");
}

function renderDisclosure(kind, label, html) {
  const id = `bmd-${kind}-${Math.random().toString(36).slice(2)}`;
  return `<span class="bmd-${kind}"><button type="button" class="bmd-btn bmd-btn-secondary" data-bmd-toggle="${kind}" data-bmd-target="#${id}" aria-expanded="false" aria-controls="${id}">${escapeHtml(label)}</button><span id="${id}" class="bmd-${kind}-menu" hidden>${html}</span></span>`;
}

function renderAccordion(node) {
  const id = `bmd-accordion-${Math.random().toString(36).slice(2)}`;
  const items = node.children.map((item, index) => `<div class="bmd-accordion-item">
  <h3><button class="bmd-accordion-button" type="button" data-bmd-toggle="collapse" data-bmd-target="#${id}-${index}" aria-expanded="${index ? "false" : "true"}" aria-controls="${id}-${index}">${escapeHtml(item.title)}</button></h3>
  <div id="${id}-${index}" class="bmd-accordion-panel"${index ? " hidden" : ""}>${item.children.map(renderNode).join("\n")}</div>
</div>`).join("\n");
  return `<section class="bmd-accordion" id="${id}">${items}</section>`;
}

function renderTabs(node) {
  const id = `bmd-tabs-${Math.random().toString(36).slice(2)}`;
  const tabs = node.children.map((tab, index) => `<li role="presentation"><button class="bmd-tab" id="${id}-tab-${index}" data-bmd-toggle="tab" data-bmd-target="#${id}-pane-${index}" type="button" role="tab" aria-controls="${id}-pane-${index}" aria-selected="${index ? "false" : "true"}">${escapeHtml(tab.title)}</button></li>`).join("");
  const panes = node.children.map((tab, index) => `<div class="bmd-tab-panel" id="${id}-pane-${index}" role="tabpanel" aria-labelledby="${id}-tab-${index}" tabindex="0"${index ? " hidden" : ""}>${tab.children.map(renderNode).join("\n")}</div>`).join("\n");
  return `<section data-bmd-tabs><ul class="bmd-tabs" role="tablist">${tabs}</ul><div class="bmd-tab-content">${panes}</div></section>`;
}

function renderTable(node) {
  const head = node.header.map((cell) => `<th>${renderInlines(cell)}</th>`).join("");
  const rows = node.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInlines(cell)}</td>`).join("")}</tr>`)
    .join("\n");
  return `<table>
  <thead><tr>${head}</tr></thead>
  <tbody>
${indent(rows, 4)}
  </tbody>
</table>`;
}

function renderInlines(nodes) {
  return nodes.map(renderInline).join("");
}

function renderInline(node) {
  switch (node.type) {
    case "text":
      return escapeHtml(node.value);
    case "strong":
      return `<strong>${renderInlines(node.children)}</strong>`;
    case "emphasis":
      return `<em>${renderInlines(node.children)}</em>`;
    case "link":
      return `<a href="${escapeAttribute(node.url)}">${renderInlines(node.children)}</a>`;
    case "image":
      return `<img src="${escapeAttribute(node.url)}" alt="${escapeAttribute(node.alt)}">`;
    case "inlineCode":
      return `<code>${escapeHtml(node.value)}</code>`;
    case "button":
      return `<button type="button" class="bmd-btn bmd-btn-${escapeAttribute(node.variant)}">${escapeHtml(node.label)}</button>`;
    default:
      return "";
  }
}

function findFirstHeading(nodes) {
  const heading = nodes.find((node) => node.type === "heading");
  return heading ? plainText(heading.children) : "";
}

function plainText(nodes) {
  return nodes.map((node) => node.value || plainText(node.children || [])).join("");
}

function indent(value, spaces) {
  const prefix = " ".repeat(spaces);
  return value.split("\n").map((line) => (line ? prefix + line : line)).join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

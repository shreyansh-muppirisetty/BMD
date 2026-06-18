"""BMD markdown parser and HTML renderer (ported from bmd.js)."""

import json
import random
import re

from themes import built_in_themes, resolve_theme
from styles import base_css


# ---------------------------------------------------------------------------
# Tokenizing / frontmatter
# ---------------------------------------------------------------------------

def tokenize(source):
    normalized = re.sub(r"\r\n?", "\n", source)
    if not normalized.startswith("---\n"):
        return {"type": "BmdTokens", "frontmatter": "", "markdown": normalized}

    close = normalized.find("\n---\n", 4)
    if close == -1:
        return {"type": "BmdTokens", "frontmatter": "", "markdown": normalized}

    return {
        "type": "BmdTokens",
        "frontmatter": normalized[4:close],
        "markdown": normalized[close + 5:],
    }


def parse_frontmatter(frontmatter):
    metadata = {}
    for line in frontmatter.split("\n"):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        match = re.match(r"^([A-Za-z][\w-]*)\s*:\s*(.*)$", line)
        if not match:
            continue
        metadata[match.group(1)] = _parse_scalar(match.group(2))
    return metadata


def _parse_scalar(value):
    trimmed = value.strip()
    if (trimmed.startswith('"') and trimmed.endswith('"')) or (
        trimmed.startswith("'") and trimmed.endswith("'")
    ):
        return trimmed[1:-1]
    if trimmed == "true":
        return True
    if trimmed == "false":
        return False
    if re.match(r"^-?\d+(\.\d+)?$", trimmed):
        return float(trimmed) if "." in trimmed else int(trimmed)
    return trimmed


# ---------------------------------------------------------------------------
# Parse entrypoint
# ---------------------------------------------------------------------------

def parse(source, options=None):
    options = options or {}
    tokens = tokenize(source)
    metadata = parse_frontmatter(tokens["frontmatter"])
    custom_themes = _load_custom_themes(options.get("customThemes", []))
    theme = resolve_theme(metadata, custom_themes)

    return {
        "type": "BmdDocument",
        "version": "0.1",
        "metadata": metadata,
        "theme": theme,
        "children": parse_markdown_blocks(tokens["markdown"]),
    }


def _load_custom_themes(paths):
    themes = []
    for path in paths:
        with open(path, "r", encoding="utf8") as f:
            themes.append(json.load(f))
    return themes


def render(source, options=None):
    options = options or {}
    ast = parse(source, options)
    return render_document(ast)


# ---------------------------------------------------------------------------
# Debug panel CSS / JS
# ---------------------------------------------------------------------------

def _get_debug_css():
    return """
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
"""


def _get_debug_script():
    return """
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
    item.innerHTML = `
      <label class="bmd-debug-label">${key}</label>
      <input type="text" class="bmd-debug-input" value="${String(value).replace(/"/g, '&quot;')}" data-token="${key}">
    `;

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
"""


# ---------------------------------------------------------------------------
# Document rendering
# ---------------------------------------------------------------------------

def render_document(ast):
    title = escape_html(
        ast["metadata"].get("title") or find_first_heading(ast["children"]) or "Beautiful Markdown"
    )
    description = ""
    if ast["metadata"].get("description"):
        description = f'<meta name="description" content="{escape_attribute(ast["metadata"]["description"])}">\n    '

    body = "\n".join(render_node(node) for node in ast["children"])
    is_debug_mode = ast["metadata"].get("debug") is True
    theme_tokens_json = json.dumps(ast["theme"]["tokens"], separators=(",", ":")).replace('"', "&quot;")
    built_in_themes_json = json.dumps(built_in_themes, separators=(",", ":")).replace('"', "&quot;")

    debug_css = _get_debug_css() if is_debug_mode else ""
    debug_script = _get_debug_script() if is_debug_mode else ""

    reading_progress_html = (
        '<div class="bmd-reading-progress" aria-hidden="true"><div></div></div>'
        if ast["metadata"].get("readingProgress")
        else ""
    )

    debug_panel_html = ""
    if is_debug_mode:
        debug_panel_html = (
            f'<div class="bmd-debug-panel" data-bmd-theme="{theme_tokens_json}" '
            f'data-bmd-themes="{built_in_themes_json}" data-bmd-current="{ast["theme"]["name"]}">'
            f'<div class="bmd-debug-header"><div style="flex: 1;"><h2>Debug Mode</h2>'
            f'<select class="bmd-debug-theme-select" style="margin-top: 8px; width: 100%; padding: 6px; '
            f"background: #1e1e1e; border: 1px solid #555; color: #d4d4d4; font-family: 'Courier New', "
            f'monospace; font-size: 12px;"><option value="">-- Select Theme --</option></select></div>'
            f'<button class="bmd-debug-close">&times;</button></div>'
            f'<div class="bmd-debug-content"></div></div>'
        )

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {description}<title>{title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>
{base_css(ast["theme"])}
{debug_css}
    </style>
  </head>
  <body class="bmd-theme-{escape_attribute(ast["theme"]["name"])}">
    <main class="bmd-document">
      <article class="bmd-content">
{indent(body, 8)}
      </article>
    </main>
    {reading_progress_html}
    {debug_panel_html}
    <script>
      const progress = document.querySelector('.bmd-reading-progress > div');
      const updateProgress = () => {{
        if (!progress) return;
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.width = (max <= 0 ? 100 : Math.min(100, Math.max(0, scrollY / max * 100))) + '%';
      }};
      addEventListener('scroll', updateProgress, {{ passive: true }});
      addEventListener('resize', updateProgress);
      updateProgress();
      document.addEventListener('click', (event) => {{
        const toggle = event.target.closest('[data-bmd-toggle]');
        if (!toggle) return;
        const target = document.querySelector(toggle.getAttribute('data-bmd-target'));
        if (!target) return;
        if (toggle.dataset.bmdToggle === 'tab') {{
          const root = toggle.closest('[data-bmd-tabs]');
          root.querySelectorAll('[role="tab"]').forEach((tab) => tab.setAttribute('aria-selected', 'false'));
          root.querySelectorAll('[role="tabpanel"]').forEach((pane) => pane.hidden = true);
          toggle.setAttribute('aria-selected', 'true');
          target.hidden = false;
        }} else {{
          const open = target.hasAttribute('hidden');
          target.toggleAttribute('hidden', !open);
          toggle.setAttribute('aria-expanded', String(open));
        }}
      }});
      {debug_script}
    </script>
  </body>
</html>
"""


# ---------------------------------------------------------------------------
# Block parsing
# ---------------------------------------------------------------------------

def parse_markdown_blocks(markdown):
    lines = markdown.split("\n")
    nodes = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        if not line.strip():
            i += 1
            continue

        directive = re.match(r"^:::\s*([A-Za-z][\w-]*)(.*)$", line)
        if directive:
            body = []
            depth = 1
            i += 1
            while i < n and depth > 0:
                if re.match(r"^:::\s*[A-Za-z]", lines[i]):
                    depth += 1
                if re.match(r"^:::\s*$", lines[i]):
                    depth -= 1
                    if depth == 0:
                        break
                body.append(lines[i])
                i += 1
            i += 1
            args = [a for a in directive.group(2).strip().split() if a]
            nodes.append({
                "type": "directive",
                "name": directive.group(1),
                "args": args,
                "children": parse_directive_body(directive.group(1), "\n".join(body)),
            })
            continue

        fence = re.match(r"^```(\w+)?\s*$", line)
        if fence:
            code = []
            i += 1
            while i < n and not re.match(r"^```\s*$", lines[i]):
                code.append(lines[i])
                i += 1
            i += 1
            nodes.append({"type": "code", "lang": fence.group(1) or "", "value": "\n".join(code)})
            continue

        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            nodes.append({
                "type": "heading",
                "depth": len(heading.group(1)),
                "children": parse_inlines(heading.group(2)),
            })
            i += 1
            continue

        if re.match(r"^ {0,3}([-*_])(?:\s*\1){2,}\s*$", line):
            nodes.append({"type": "thematicBreak"})
            i += 1
            continue

        if (
            re.match(r"^\s*\|.+\|\s*$", line)
            and i + 1 < n
            and re.match(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$", lines[i + 1])
        ):
            table_lines = [line, lines[i + 1]]
            i += 2
            while i < n and re.match(r"^\s*\|.+\|\s*$", lines[i]):
                table_lines.append(lines[i])
                i += 1
            nodes.append(parse_table(table_lines))
            continue

        if re.match(r"^>\s?", line):
            quote = []
            while i < n and re.match(r"^>\s?", lines[i]):
                quote.append(re.sub(r"^>\s?", "", lines[i]))
                i += 1
            nodes.append({"type": "blockquote", "children": parse_markdown_blocks("\n".join(quote))})
            continue

        if re.match(r"^\s*([-+*]|\d+\.)\s+", line):
            ordered = bool(re.match(r"^\s*\d+\.\s+", line))
            items = []
            while i < n and (
                re.match(r"^\s*\d+\.\s+", lines[i]) if ordered else re.match(r"^\s*[-+*]\s+", lines[i])
            ):
                item_text = re.sub(r"^\s*([-+*]|\d+\.)\s+", "", lines[i])
                items.append({
                    "type": "listItem",
                    "children": [{"type": "paragraph", "children": parse_inlines(item_text)}],
                })
                i += 1
            nodes.append({"type": "list", "ordered": ordered, "children": items})
            continue

        if re.match(r"^\s*<", line):
            html = []
            while i < n and lines[i].strip():
                html.append(lines[i])
                i += 1
            nodes.append({"type": "html", "value": "\n".join(html)})
            continue

        paragraph = [line]
        i += 1
        while (
            i < n
            and lines[i].strip()
            and not re.match(r"^(#{1,6})\s+", lines[i])
            and not re.match(r"^```", lines[i])
            and not re.match(r"^:::\s*", lines[i])
        ):
            paragraph.append(lines[i])
            i += 1
        nodes.append({"type": "paragraph", "children": parse_inlines(" ".join(paragraph))})

    return nodes


def parse_table(lines):
    rows = []
    for line in lines:
        trimmed = line.strip()
        trimmed = re.sub(r"^\|", "", trimmed)
        trimmed = re.sub(r"\|$", "", trimmed)
        rows.append([cell.strip() for cell in trimmed.split("|")])

    return {
        "type": "table",
        "header": [parse_inlines(cell) for cell in rows[0]],
        "rows": [[parse_inlines(cell) for cell in row] for row in rows[2:]],
    }


def parse_directive_body(name, body):
    if name == "accordion":
        return parse_accordion(body)
    if name == "tabs":
        return parse_tabs(body)
    cleaned = re.sub(r"^style:\n(?:  .+\n?)*", "", body, count=1, flags=re.MULTILINE)
    return parse_markdown_blocks(cleaned)


def parse_accordion(body):
    parts = re.split(r"\n(?=\? )", body)
    parts = [p for p in parts if p]
    items = []
    for part in parts:
        lines = part.split("\n")
        items.append({
            "title": re.sub(r"^\?\s*", "", lines[0]).strip(),
            "children": parse_markdown_blocks("\n".join(lines[1:]).strip()),
        })
    return items


def parse_tabs(body):
    parts = re.split(r"\n(?=@tab )", body)
    parts = [p for p in parts if p]
    items = []
    for part in parts:
        without_prefix = re.sub(r"^@tab\s+", "", part, count=1)
        lines = without_prefix.split("\n")
        items.append({
            "title": lines[0].strip(),
            "children": parse_markdown_blocks("\n".join(lines[1:]).strip()),
        })
    return items


# ---------------------------------------------------------------------------
# Inline parsing
# ---------------------------------------------------------------------------

_INLINE_PATTERN = re.compile(
    r"(\[button [^\]]+\]\s+[^\n]+|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)"
)


def parse_inlines(text):
    nodes = []
    last = 0
    for match in _INLINE_PATTERN.finditer(text):
        if match.start() > last:
            nodes.append({"type": "text", "value": text[last:match.start()]})
        nodes.append(parse_inline_token(match.group(0)))
        last = match.end()

    if last < len(text):
        nodes.append({"type": "text", "value": text[last:]})
    return nodes


def parse_inline_token(token):
    match = re.match(r"^\[button ([^\]]+)\]\s+(.+)$", token)
    if match:
        return {"type": "button", "variant": match.group(1).strip(), "label": match.group(2).strip()}

    match = re.match(r"^!\[([^\]]*)\]\(([^)]+)\)$", token)
    if match:
        return {"type": "image", "alt": match.group(1), "url": match.group(2)}

    match = re.match(r"^\[([^\]]+)\]\(([^)]+)\)$", token)
    if match:
        return {"type": "link", "url": match.group(2), "children": [{"type": "text", "value": match.group(1)}]}

    if token.startswith("`"):
        return {"type": "inlineCode", "value": token[1:-1]}

    if token.startswith("**"):
        return {"type": "strong", "children": parse_inlines(token[2:-2])}

    if token.startswith("*"):
        return {"type": "emphasis", "children": parse_inlines(token[1:-1])}

    return {"type": "text", "value": token}


# ---------------------------------------------------------------------------
# Block rendering
# ---------------------------------------------------------------------------

def render_node(node):
    node_type = node.get("type")
    if node_type == "heading":
        depth = node["depth"]
        return f"<h{depth}>{render_inlines(node['children'])}</h{depth}>"
    if node_type == "paragraph":
        return f"<p>{render_inlines(node['children'])}</p>"
    if node_type == "blockquote":
        inner = "\n".join(render_node(child) for child in node["children"])
        return f"<blockquote>\n{indent(inner, 2)}\n</blockquote>"
    if node_type == "list":
        tag = "ol" if node["ordered"] else "ul"
        inner = "\n".join(render_node(child) for child in node["children"])
        return f"<{tag}>\n{indent(inner, 2)}\n</{tag}>"
    if node_type == "listItem":
        return f"<li>{chr(10).join(render_node(child) for child in node['children'])}</li>"
    if node_type == "table":
        return render_table(node)
    if node_type == "code":
        lang_attr = f' class="language-{escape_attribute(node["lang"])}"' if node["lang"] else ""
        return f"<pre><code{lang_attr}>{escape_html(node['value'])}</code></pre>"
    if node_type == "thematicBreak":
        return "<hr>"
    if node_type == "html":
        return node["value"]
    if node_type == "directive":
        return render_directive(node)
    return ""


def render_directive(node):
    children = node.get("children")
    html = "\n".join(render_node(child) for child in children) if isinstance(children, list) else ""
    kind = node["name"]
    alert_kinds = ["note", "tip", "info", "success", "warning", "danger"]

    if kind in alert_kinds:
        variant_map = {"note": "secondary", "tip": "primary", "info": "info"}
        variant = variant_map.get(kind, kind)
        return f'<aside class="bmd-alert bmd-alert-{variant}" role="note">{html}</aside>'

    if kind == "card":
        return f'<section class="bmd-card {classes(node["args"])}"><div class="bmd-card-body">{html}</div></section>'
    if kind == "accordion":
        return render_accordion(node)
    if kind == "tabs":
        return render_tabs(node)
    if kind == "collapse":
        summary = escape_html(" ".join(node["args"]) or "Details")
        return f'<details class="bmd-collapse"><summary>{summary}</summary>{html}</details>'
    if kind == "modal":
        return f'<section class="bmd-modal" role="dialog" aria-modal="false"><div class="bmd-modal-body">{html}</div></section>'
    if kind == "toast":
        return f'<section class="bmd-toast" role="status">{html}</section>'
    if kind == "carousel":
        return f'<section class="bmd-carousel" aria-label="Carousel">{html}</section>'
    if kind == "offcanvas":
        return f'<aside class="bmd-offcanvas" aria-modal="false">{html}</aside>'
    if kind == "badge":
        return f'<span class="bmd-badge">{plain_text_from_nodes(node["children"])}</span>'
    if kind == "breadcrumbs":
        parts = plain_text_from_nodes(node["children"]).split("/")
        items = "".join(f"<li>{escape_html(part.strip())}</li>" for part in parts)
        return f'<nav aria-label="breadcrumb"><ol class="bmd-breadcrumb">{items}</ol></nav>'
    if kind == "dropdown":
        return render_disclosure("dropdown", " ".join(node["args"]) or "Menu", html)
    if kind == "tooltip":
        tip = escape_attribute(plain_text_from_nodes(node["children"]))
        label = escape_html(" ".join(node["args"]) or "Tooltip")
        return f'<span class="bmd-tooltip" tabindex="0" data-tip="{tip}">{label}</span>'
    if kind == "popover":
        return render_disclosure("popover", " ".join(node["args"]) or "Popover", html)
    if kind == "progress":
        value = progress_value(node)
        return (
            f'<div class="bmd-progress" role="progressbar" aria-label="Progress" '
            f'aria-valuenow="{value}" aria-valuemin="0" aria-valuemax="100">'
            f'<div style="width: {value}%">{value}%</div></div>'
        )
    if kind == "pagination":
        parts = [p for p in re.split(r"\s+", plain_text_from_nodes(node["children"])) if p]
        items = "".join(
            f'<li><button type="button"{" aria-current=\"page\"" if idx == 0 else ""}>{escape_html(part)}</button></li>'
            for idx, part in enumerate(parts)
        )
        return f'<nav aria-label="Pagination"><ul class="bmd-pagination">{items}</ul></nav>'
    if kind == "spinner":
        label = escape_html(plain_text_from_nodes(node["children"]) or "Loading")
        return f'<div class="bmd-spinner" role="status"><span class="bmd-sr-only">{label}</span></div>'
    if kind == "list-group":
        parts = []
        for child in node["children"]:
            if child["type"] == "list":
                for item in child["children"]:
                    inner = "".join(render_node(c) for c in item["children"])
                    parts.append(f'<div class="bmd-list-group-item">{inner}</div>')
            else:
                parts.append(f'<div class="bmd-list-group-item">{render_node(child)}</div>')
        return f'<div class="bmd-list-group">{"".join(parts)}</div>'
    if kind == "navbar":
        parts = plain_text_from_nodes(node["children"]).split("|")
        buttons = "".join(f'<button type="button">{escape_html(part.strip())}</button>' for part in parts)
        return f'<nav class="bmd-navbar" aria-label="Navigation">{buttons}</nav>'

    return f'<section class="bmd-{escape_attribute(kind)}">{html}</section>'


def progress_value(node):
    match = re.search(r"\d+", plain_text_from_nodes(node["children"]))
    if not match:
        return 0
    return max(0, min(100, int(match.group(0))))


def plain_text_from_nodes(nodes):
    parts = []
    for node in nodes:
        if node["type"] in ("paragraph", "heading"):
            parts.append(plain_text(node["children"]))
        elif node["type"] == "list":
            parts.append(" ".join(plain_text_from_nodes(item["children"]) for item in node["children"]))
        else:
            parts.append(node.get("value", ""))
    return " ".join(parts).strip()


def classes(args):
    return " ".join(f"bmd-{arg}" for arg in args)


def render_disclosure(kind, label, html):
    element_id = f"bmd-{kind}-{_random_id()}"
    return (
        f'<span class="bmd-{kind}"><button type="button" class="bmd-btn bmd-btn-secondary" '
        f'data-bmd-toggle="{kind}" data-bmd-target="#{element_id}" aria-expanded="false" '
        f'aria-controls="{element_id}">{escape_html(label)}</button>'
        f'<span id="{element_id}" class="bmd-{kind}-menu" hidden>{html}</span></span>'
    )


def render_accordion(node):
    accordion_id = f"bmd-accordion-{_random_id()}"
    items = []
    for index, item in enumerate(node["children"]):
        panel_id = f"{accordion_id}-{index}"
        expanded = "false" if index else "true"
        hidden_attr = " hidden" if index else ""
        inner = "\n".join(render_node(child) for child in item["children"])
        items.append(
            f'<div class="bmd-accordion-item">\n'
            f'  <h3><button class="bmd-accordion-button" type="button" data-bmd-toggle="collapse" '
            f'data-bmd-target="#{panel_id}" aria-expanded="{expanded}" aria-controls="{panel_id}">'
            f'{escape_html(item["title"])}</button></h3>\n'
            f'  <div id="{panel_id}" class="bmd-accordion-panel"{hidden_attr}>{inner}</div>\n'
            f'</div>'
        )
    return f'<section class="bmd-accordion" id="{accordion_id}">{chr(10).join(items)}</section>'


def render_tabs(node):
    tabs_id = f"bmd-tabs-{_random_id()}"
    tabs = []
    panes = []
    for index, tab in enumerate(node["children"]):
        tab_btn_id = f"{tabs_id}-tab-{index}"
        pane_id = f"{tabs_id}-pane-{index}"
        selected = "false" if index else "true"
        hidden_attr = " hidden" if index else ""
        tabs.append(
            f'<li role="presentation"><button class="bmd-tab" id="{tab_btn_id}" data-bmd-toggle="tab" '
            f'data-bmd-target="#{pane_id}" type="button" role="tab" aria-controls="{pane_id}" '
            f'aria-selected="{selected}">{escape_html(tab["title"])}</button></li>'
        )
        inner = "\n".join(render_node(child) for child in tab["children"])
        panes.append(
            f'<div class="bmd-tab-panel" id="{pane_id}" role="tabpanel" aria-labelledby="{tab_btn_id}" '
            f'tabindex="0"{hidden_attr}>{inner}</div>'
        )
    return (
        f'<section data-bmd-tabs><ul class="bmd-tabs" role="tablist">{"".join(tabs)}</ul>'
        f'<div class="bmd-tab-content">{chr(10).join(panes)}</div></section>'
    )


def render_table(node):
    head = "".join(f"<th>{render_inlines(cell)}</th>" for cell in node["header"])
    rows = "\n".join(
        f"<tr>{''.join(f'<td>{render_inlines(cell)}</td>' for cell in row)}</tr>" for row in node["rows"]
    )
    return f"""<table>
  <thead><tr>{head}</tr></thead>
  <tbody>
{indent(rows, 4)}
  </tbody>
</table>"""


def render_inlines(nodes):
    return "".join(render_inline(node) for node in nodes)


def render_inline(node):
    node_type = node["type"]
    if node_type == "text":
        return escape_html(node["value"])
    if node_type == "strong":
        return f"<strong>{render_inlines(node['children'])}</strong>"
    if node_type == "emphasis":
        return f"<em>{render_inlines(node['children'])}</em>"
    if node_type == "link":
        return f'<a href="{escape_attribute(node["url"])}">{render_inlines(node["children"])}</a>'
    if node_type == "image":
        return f'<img src="{escape_attribute(node["url"])}" alt="{escape_attribute(node["alt"])}">'
    if node_type == "inlineCode":
        return f"<code>{escape_html(node['value'])}</code>"
    if node_type == "button":
        return f'<button type="button" class="bmd-btn bmd-btn-{escape_attribute(node["variant"])}">{escape_html(node["label"])}</button>'
    return ""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def find_first_heading(nodes):
    for node in nodes:
        if node["type"] == "heading":
            return plain_text(node["children"])
    return ""


def plain_text(nodes):
    parts = []
    for node in nodes:
        if "value" in node and node["value"] is not None:
            parts.append(node["value"])
        else:
            parts.append(plain_text(node.get("children", [])))
    return "".join(parts)


def indent(value, spaces):
    prefix = " " * spaces
    return "\n".join((prefix + line if line else line) for line in value.split("\n"))


def escape_html(value):
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def escape_attribute(value):
    return escape_html(value).replace("'", "&#39;")


def _random_id():
    # Mirrors JS Math.random().toString(36).slice(2)
    return "".join(random.choices("0123456789abcdefghijklmnopqrstuvwxyz", k=11))

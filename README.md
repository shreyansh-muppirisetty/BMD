# Beautiful Markdown (BMD)

Beautiful Markdown is Markdown with presentation defaults. It extends Markdown rather than replacing it: an existing Markdown document is valid BMD, and BMD adds YAML frontmatter for theme selection.

```markdown
---
theme: modern
accent: blue
font: inter
---

# A Beautiful Document

Markdown stays readable. BMD makes the output polished.
```

## Goals

- Preserve CommonMark readability and compatibility.
- Generate clean, semantic HTML5.
- Apply modern styling automatically.
- Support built-in and custom themes.
- Allow raw HTML as an escape hatch when BMD lacks a feature.

## Quick Start

Render the example document:

```powershell
npm test
npm run render
```

The generated page will be written to `dist/showcase.html`.

## Project Layout

- `docs/spec.md`: language specification.
- `docs/grammar.md`: grammar definition.
- `docs/ast.md`: AST shape.
- `docs/parser-architecture.md`: tokenizer, parser, AST, HTML generator, output flow.
- `docs/theme-system.md`: built-in and custom theme architecture.
- `docs/html-generation.md`: semantic HTML strategy.
- `docs/components.md`: directive and manual component specification.
- `docs/accessibility.md`: component accessibility rules.
- `docs/bootstrap-integration.md`: manual component strategy.
- `examples/`: BMD documents and custom theme examples.
- `src/`: reference parser, renderer, themes, and CLI.

## Compatibility Note

BMD is designed around CommonMark. The reference implementation exposes the architecture and handles standard Markdown constructs used by the examples. A production implementation should connect the `parseMarkdownBlocks` stage to a CommonMark-compliant parser such as `markdown-it`, `commonmark.js`, or `micromark`.

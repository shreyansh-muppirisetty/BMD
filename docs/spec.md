# Beautiful Markdown Language Specification

Beautiful Markdown (BMD) is a conservative extension of CommonMark Markdown. A valid CommonMark document is a valid BMD document. BMD adds document-level presentation metadata through YAML frontmatter and a theme system, while leaving Markdown syntax untouched.

## Design Principles

1. Markdown remains the source language.
2. BMD adds styling and semantic component syntax without replacing Markdown.
3. Documents must be readable as plain text.
4. Raw HTML is allowed but discouraged.
5. The renderer must produce semantic HTML5.

## Document Structure

A BMD document is:

```text
Optional YAML frontmatter
Markdown body
```

Frontmatter appears only at the start of the file and is delimited by `---` lines.

```yaml
---
theme: modern
accent: blue
font: inter
---
```

## Markdown Compatibility

BMD supports all standard Markdown features:

- Headings
- Paragraphs
- Strong and emphasis
- Links
- Images
- Ordered and unordered lists
- Tables
- Blockquotes
- Fenced code blocks
- Horizontal rules
- Inline code
- Raw HTML

## BMD Metadata

Supported frontmatter keys:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | string | `modern` | Built-in or custom theme name. |
| `accent` | string | theme default | Accent color token or CSS color. |
| `font` | string | theme default | Font family token or CSS font stack. |
| `title` | string | first heading | HTML document title. |
| `description` | string | empty | Optional meta description. |

Unknown keys are preserved in the AST as metadata.

## Built-In Themes

BMD includes:

- `modern`
- `minimal`
- `github`
- `glass`
- `corporate`

Themes control colors, typography, spacing, border radius, shadows, and animations.

## Custom Themes

Users may define themes in JSON files. A custom theme can inherit from a built-in theme and override individual tokens.

```json
{
  "name": "editorial",
  "extends": "minimal",
  "tokens": {
    "accent": "#b45309",
    "fontBody": "Georgia, serif",
    "radius": "4px"
  }
}
```

## Raw HTML

Raw HTML is passed through to the output. It should be used only when BMD lacks a feature. Renderers may expose a safety mode that escapes or removes raw HTML for untrusted input.

## Components

BMD supports semantic directives:

```markdown
:::warning
Content
:::
```

Built-in semantic components are `note`, `tip`, `info`, `success`, `warning`, and `danger`. Manual BMD components include buttons, cards, accordions, tabs, collapse sections, modals, toasts, carousels, offcanvas panels, navbars, list groups, badges, breadcrumbs, dropdowns, tooltips, popovers, progress bars, pagination, and spinners.

Component names are semantic where possible. Visual details belong in themes or small modifiers:

```markdown
:::card shadow rounded
Content
:::
```

Interactive components use built-in progressive enhancement. BMD does not allow arbitrary JavaScript.

## Non-Goals

BMD does not include:

- React-like components
- Arbitrary JavaScript execution
- Complex client-side interactivity
- A replacement syntax for Markdown

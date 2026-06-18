# Parser Architecture

```text
BMD Source
-> Tokenizer
-> Parser
-> AST
-> HTML Generator
-> Final Styled Output
```

## 1. Tokenizer

The tokenizer identifies BMD-level regions:

- Optional YAML frontmatter
- Markdown body
- Directive block boundaries

It does not reinterpret Markdown syntax. That work is delegated to the Markdown parser.

## 2. Parser

The parser:

1. Parses frontmatter into metadata.
2. Parses Markdown into a CommonMark-compatible AST.
3. Parses BMD directives into component nodes.
4. Resolves the requested theme.
5. Produces a `BmdDocument` AST.

## 3. AST

The AST preserves Markdown semantics and adds:

- Frontmatter metadata
- Resolved theme tokens
- Optional source positions
- Component nodes for BMD directives

## 4. HTML Generator

The generator transforms the AST into semantic HTML5:

- `main.bmd-document`
- `article.bmd-content`
- `h1` through `h6`
- `p`, `a`, `img`, `blockquote`, `pre`, `code`
- `table`, `thead`, `tbody`, `tr`, `th`, `td`
- Manual component markup for controlled interactivity

## 5. Final Styled Output

The renderer combines:

- Semantic HTML body
- Built-in base CSS
- Theme CSS variables
- Optional custom theme overrides

No arbitrary JavaScript is emitted. BMD may include tiny controlled progressive-enhancement code.

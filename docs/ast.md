# AST Structure

BMD uses a small document wrapper around a Markdown AST. Markdown node names should follow the CommonMark vocabulary where possible.

```ts
interface BmdDocument {
  type: "BmdDocument";
  version: "0.1";
  metadata: BmdMetadata;
  theme: ResolvedTheme;
  children: MarkdownNode[];
}

interface BmdMetadata {
  theme?: string;
  accent?: string;
  font?: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}
```

## Markdown Nodes

Core block nodes:

- `heading`
- `paragraph`
- `blockquote`
- `list`
- `listItem`
- `table`
- `tableRow`
- `tableCell`
- `code`
- `thematicBreak`
- `html`

Core inline nodes:

- `text`
- `emphasis`
- `strong`
- `link`
- `image`
- `inlineCode`
- `html`
- `break`

## Source Positions

Implementations should preserve source positions when available:

```ts
interface Position {
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
}
```

Positions enable diagnostics, editor integrations, and future linting.

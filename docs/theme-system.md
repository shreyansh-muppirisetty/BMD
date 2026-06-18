# Theme System Architecture

BMD themes are token maps. Tokens compile to CSS custom properties, and the base stylesheet consumes those properties.

## Theme Tokens

```ts
interface ThemeTokens {
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  colorMuted: string;
  colorBorder: string;
  accent: string;
  fontBody: string;
  fontMono: string;
  contentWidth: string;
  spacing: string;
  radius: string;
  shadow: string;
  animation: string;
}
```

## Built-In Themes

- `modern`: balanced typography, soft surfaces, rounded details.
- `minimal`: quiet layout, low decoration, crisp contrast.
- `github`: familiar documentation styling.
- `glass`: translucent surfaces and subtle depth.
- `corporate`: restrained, presentation-ready documents.

## Custom Theme Resolution

Theme resolution order:

1. Load built-in theme.
2. Load custom theme if configured.
3. Apply `extends` inheritance.
4. Apply document frontmatter overrides such as `accent` and `font`.
5. Emit CSS variables.

## Custom Theme File

```json
{
  "name": "field-notes",
  "extends": "modern",
  "tokens": {
    "accent": "#2563eb",
    "fontBody": "Inter, system-ui, sans-serif",
    "radius": "6px"
  }
}
```

# HTML Generation Strategy

BMD generates clean, semantic HTML5. Styling is applied through classes and CSS variables, not inline style attributes on every element.

## Document Shell

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Document title</title>
    <style>...</style>
  </head>
  <body class="bmd-theme-modern">
    <main class="bmd-document">
      <article class="bmd-content">
        ...
      </article>
    </main>
  </body>
</html>
```

## Escaping

Markdown text content is escaped. Raw HTML is allowed and emitted unchanged by default. Secure renderers should provide a mode to sanitize or escape raw HTML for untrusted documents.

## Syntax Highlighting

The reference renderer adds language classes to fenced code blocks:

```html
<pre><code class="language-js">...</code></pre>
```

A production renderer may add server-side highlighting, but BMD must remain useful without JavaScript.

## Component Integration

BMD includes built-in component CSS. It may emit tiny controlled JavaScript for tabs, accordions, dropdowns, popovers, and collapse behavior.

Directive renderers must emit ARIA attributes, including `aria-expanded`, `aria-controls`, `role="tablist"`, `role="tab"`, and `role="tabpanel"` where relevant.

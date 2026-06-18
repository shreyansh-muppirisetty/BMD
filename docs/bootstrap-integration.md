# Manual Component Strategy

BMD no longer imports Bootstrap. It keeps Bootstrap-inspired component coverage, but renders manual BMD classes and built-in CSS.

Renderer responsibilities:

1. Convert BMD directives to semantic component HTML.
2. Emit BMD component CSS.
3. Emit tiny controlled JavaScript only for tabs and disclosure components.
4. Avoid arbitrary user JavaScript.
5. Keep content readable without JavaScript where possible.

Static content remains visible. Components that need behavior receive `data-bmd-*` attributes.

BMD themes remain the design layer. CSS variables tune typography, color, spacing, radius, and shadows.

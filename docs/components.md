# BMD Components

BMD components use directive blocks and inline commands. They stay readable Markdown and render to built-in BMD HTML, CSS, and tiny controlled JavaScript.

## Directive Blocks

```markdown
:::warning
Careful.
:::

:::card shadow rounded
### Title
Content
:::
```

Directive blocks may nest. Unknown directives render as semantic sections with a `bmd-*` class.

## Semantic Components

These map to themed BMD alerts:

- `:::note`
- `:::tip`
- `:::info`
- `:::success`
- `:::warning`
- `:::danger`

## Component Coverage

Supported BMD forms:

- Buttons: `[button primary] Save`
- Outline buttons: `[button outline-primary] Learn More`
- Cards: `:::card`
- Alerts: semantic directives above
- Accordions: `:::accordion` with `? Question`
- Tabs: `:::tabs` with `@tab Name`
- Collapse: `:::collapse Details`
- Badges: `:::badge`
- Breadcrumbs: `:::breadcrumbs`
- Dropdowns: `:::dropdown`
- Tooltips: `:::tooltip`
- Popovers: `:::popover`
- Modals: `:::modal`
- Toasts: `:::toast`
- Carousels: `:::carousel`
- Progress bars: `:::progress`
- Pagination: `:::pagination`
- Spinners: `:::spinner`
- List groups: `:::list-group`
- Navbars: `:::navbar`
- Offcanvas panels: `:::offcanvas`

The reference renderer fully wires buttons, cards, semantic alerts, accordions, tabs, collapse, modal, toast, carousel, and offcanvas. Other directives get stable semantic wrappers for later specialized renderers.

## Customization

```markdown
:::card
Content
:::

:::card shadow rounded
Content
:::

:::card
style:
  shadow: lg
  radius: xl
  padding: md
Content
:::
```

Unsupported style keys are ignored.

## JavaScript Policy

BMD emits only controlled JavaScript needed for tabs and disclosure components. No framework imports, arbitrary JavaScript, React components, or application logic.

export function cssVariables(theme) {
  return Object.entries(theme.tokens)
    .map(([key, value]) => `  --bmd-${toKebab(key)}: ${value};`)
    .join("\n");
}

function toKebab(value) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function baseCss(theme) {
  return `:root {
${cssVariables(theme)}
}

* {
  box-sizing: border-box;
}

html {
  color: var(--bmd-color-text);
  background: var(--bmd-color-background);
  font-family: var(--bmd-font-body);
  line-height: 1.65;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
}

.bmd-document {
  min-height: 100vh;
  padding: clamp(24px, 6vw, 72px) clamp(18px, 5vw, 48px);
}

.bmd-content {
  width: min(100%, var(--bmd-content-width));
  margin: 0 auto;
  padding: clamp(24px, 5vw, 56px);
  background: var(--bmd-color-surface);
  border: 1px solid var(--bmd-color-border);
  border-radius: var(--bmd-radius);
  box-shadow: var(--bmd-shadow);
}

.bmd-theme-glass .bmd-content {
  backdrop-filter: blur(18px);
}

h1, h2, h3, h4, h5, h6 {
  margin: calc(var(--bmd-spacing) * 1.8) 0 calc(var(--bmd-spacing) * 0.6);
  line-height: 1.15;
  letter-spacing: 0;
}

h1:first-child,
h2:first-child,
h3:first-child {
  margin-top: 0;
}

h1 {
  font-size: clamp(2.2rem, 8vw, 4.2rem);
}

h2 {
  padding-top: calc(var(--bmd-spacing) * 0.7);
  border-top: 1px solid var(--bmd-color-border);
  font-size: clamp(1.55rem, 4vw, 2.2rem);
}

h3 {
  font-size: 1.35rem;
}

p, ul, ol, blockquote, pre, table, figure,
.bmd-card,
.bmd-alert,
.bmd-accordion,
[data-bmd-tabs],
.bmd-collapse,
.bmd-modal,
.bmd-toast,
.bmd-carousel,
.bmd-progress,
.bmd-list-group,
.bmd-navbar,
.bmd-offcanvas {
  margin: 0 0 calc(var(--bmd-spacing) * 1.1);
}

a {
  color: var(--bmd-accent);
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
  transition: color var(--bmd-animation);
}

a:hover {
  color: color-mix(in srgb, var(--bmd-accent), black 18%);
}

ul, ol {
  padding-left: 1.45rem;
}

li + li {
  margin-top: 0.38rem;
}

blockquote {
  padding: 1rem 1.15rem;
  color: var(--bmd-color-muted);
  border-left: 4px solid var(--bmd-accent);
  background: color-mix(in srgb, var(--bmd-accent), transparent 92%);
  border-radius: 0 var(--bmd-radius) var(--bmd-radius) 0;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--bmd-radius);
}

hr {
  height: 1px;
  margin: calc(var(--bmd-spacing) * 2) 0;
  border: 0;
  background: var(--bmd-color-border);
}

code {
  font-family: var(--bmd-font-mono);
  font-size: 0.92em;
}

:not(pre) > code {
  padding: 0.16em 0.35em;
  background: color-mix(in srgb, var(--bmd-color-border), transparent 45%);
  border-radius: calc(var(--bmd-radius) / 2);
}

pre {
  overflow: auto;
  padding: 1rem;
  color: #e5edf7;
  background: #111827;
  border-radius: var(--bmd-radius);
}

pre code {
  padding: 0;
  background: transparent;
}

table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border: 1px solid var(--bmd-color-border);
  border-radius: var(--bmd-radius);
}

th, td {
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid var(--bmd-color-border);
  text-align: left;
  vertical-align: top;
}

th {
  color: var(--bmd-color-text);
  background: color-mix(in srgb, var(--bmd-color-border), transparent 55%);
  font-weight: 700;
}

tr:last-child td {
  border-bottom: 0;
}

.bmd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.4rem;
  padding: 0.48rem 0.8rem;
  border: 1px solid transparent;
  border-radius: var(--bmd-radius);
  background: var(--bmd-accent);
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  vertical-align: middle;
  transition: transform var(--bmd-animation), box-shadow var(--bmd-animation), background var(--bmd-animation);
}

.bmd-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
}

.bmd-btn-secondary {
  background: var(--bmd-color-muted);
}

.bmd-btn-outline-primary {
  color: var(--bmd-accent);
  background: transparent;
  border-color: var(--bmd-accent);
}

.bmd-card,
.bmd-alert,
.bmd-modal,
.bmd-toast,
.bmd-offcanvas,
.bmd-carousel {
  border: 1px solid var(--bmd-color-border);
  border-radius: var(--bmd-radius);
  background: var(--bmd-color-surface);
}

.bmd-card-body,
.bmd-modal-body,
.bmd-toast,
.bmd-offcanvas,
.bmd-carousel {
  padding: 1rem;
}

.bmd-card h3,
.bmd-modal h3 {
  margin-top: 0;
}

.bmd-card p:last-child,
.bmd-alert p:last-child,
.bmd-modal p:last-child,
.bmd-toast p:last-child,
.bmd-offcanvas p:last-child,
.bmd-carousel p:last-child {
  margin-bottom: 0;
}

.bmd-shadow {
  box-shadow: var(--bmd-shadow);
}

.bmd-rounded {
  border-radius: var(--bmd-radius);
}

.bmd-alert {
  padding: 0.85rem 1rem;
  border-left: 4px solid var(--bmd-accent);
  background: color-mix(in srgb, var(--bmd-accent), white 94%);
}

.bmd-alert-warning { border-left-color: #d97706; }
.bmd-alert-danger { border-left-color: #dc2626; }
.bmd-alert-success { border-left-color: #16a34a; }
.bmd-alert-info { border-left-color: #0891b2; }

.bmd-tabs,
.bmd-list-group,
.bmd-pagination,
.bmd-breadcrumb {
  margin: 0 0 calc(var(--bmd-spacing) * 0.9);
}

.bmd-accordion-item,
.bmd-list-group-item {
  border: 1px solid var(--bmd-color-border);
  border-bottom: 0;
}

.bmd-accordion-item:first-child,
.bmd-list-group-item:first-child {
  border-radius: var(--bmd-radius) var(--bmd-radius) 0 0;
}

.bmd-accordion-item:last-child,
.bmd-list-group-item:last-child {
  border-bottom: 1px solid var(--bmd-color-border);
  border-radius: 0 0 var(--bmd-radius) var(--bmd-radius);
}

.bmd-accordion h3 {
  margin: 0;
}

.bmd-accordion-button,
.bmd-tab {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 0;
  background: transparent;
  color: var(--bmd-color-text);
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.bmd-accordion-button:hover,
.bmd-tab:hover {
  background: color-mix(in srgb, var(--bmd-accent), transparent 94%);
}

.bmd-accordion-panel {
  padding: 0 1rem 1rem;
}

.bmd-tabs,
.bmd-pagination,
.bmd-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  list-style: none;
}

.bmd-tabs li,
.bmd-pagination li,
.bmd-breadcrumb li {
  margin-top: 0;
}

.bmd-tab {
  width: auto;
  border-bottom: 2px solid transparent;
}

.bmd-tab[aria-selected="true"] {
  color: var(--bmd-accent);
  border-bottom-color: var(--bmd-accent);
}

.bmd-tab-content {
  padding-top: 1rem;
  min-height: 4rem;
}

.bmd-badge {
  display: inline-block;
  padding: 0.24rem 0.5rem;
  border-radius: 999px;
  background: var(--bmd-accent);
  color: white;
  font-size: 0.82em;
  font-weight: 700;
  margin-bottom: calc(var(--bmd-spacing) * 0.65);
}

.bmd-breadcrumb li + li::before {
  content: "/";
  margin-right: 0.4rem;
  color: var(--bmd-color-muted);
}

.bmd-dropdown,
.bmd-popover {
  position: relative;
  display: inline-block;
  margin: 0 0 calc(var(--bmd-spacing) * 0.8);
}

.bmd-dropdown-menu,
.bmd-popover-menu {
  position: absolute;
  z-index: 10;
  min-width: 12rem;
  margin-top: 0.35rem;
  padding: 0.75rem;
  border: 1px solid var(--bmd-color-border);
  border-radius: var(--bmd-radius);
  background: var(--bmd-color-surface);
  box-shadow: var(--bmd-shadow);
}

.bmd-tooltip {
  display: inline-block;
  margin: 0 0 calc(var(--bmd-spacing) * 0.8);
  border-bottom: 1px dotted var(--bmd-accent);
  cursor: help;
}

.bmd-tooltip:hover::after,
.bmd-tooltip:focus::after {
  content: attr(data-tip);
  display: block;
  width: max-content;
  max-width: 22rem;
  margin-left: 0.5rem;
  padding: 0.25rem 0.45rem;
  border-radius: calc(var(--bmd-radius) / 2);
  background: #111827;
  color: white;
  font-size: 0.85em;
}

.bmd-progress {
  overflow: hidden;
  height: 1.25rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bmd-color-border), transparent 40%);
}

.bmd-progress > div {
  height: 100%;
  background: var(--bmd-accent);
  color: white;
  text-align: center;
  font-size: 0.8rem;
}

.bmd-pagination button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  min-height: 2.25rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--bmd-color-border);
  border-radius: calc(var(--bmd-radius) / 2);
  background: var(--bmd-color-surface);
  color: var(--bmd-accent);
  font: inherit;
  cursor: pointer;
}

.bmd-pagination button[aria-current="page"] {
  background: var(--bmd-accent);
  color: white;
  border-color: var(--bmd-accent);
}

.bmd-reading-progress {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  height: 0.45rem;
  background: color-mix(in srgb, var(--bmd-color-border), transparent 30%);
}

.bmd-reading-progress > div {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--bmd-accent), color-mix(in srgb, var(--bmd-accent), white 30%));
  transition: width 80ms linear;
}

.bmd-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid var(--bmd-color-border);
  border-top-color: var(--bmd-accent);
  border-radius: 50%;
  animation: bmd-spin 0.8s linear infinite;
}

.bmd-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.bmd-navbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.8rem 1rem;
  border: 1px solid var(--bmd-color-border);
  border-radius: var(--bmd-radius);
  background: color-mix(in srgb, var(--bmd-color-border), transparent 70%);
}

.bmd-navbar button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--bmd-color-text);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.bmd-modal-head {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--bmd-color-border);
  color: var(--bmd-color-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.78rem;
}

.bmd-collapse {
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--bmd-color-border);
  border-radius: var(--bmd-radius);
}

.bmd-collapse summary {
  cursor: pointer;
  font-weight: 700;
}

@keyframes bmd-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .bmd-content {
    padding: 22px;
  }

  table {
    display: block;
    overflow-x: auto;
  }
}`;
}

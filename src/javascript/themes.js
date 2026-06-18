export const builtInThemes = {
  modern: {
    name: "modern",
    tokens: {
      colorBackground: "#f8fafc",
      colorSurface: "#ffffff",
      colorText: "#172033",
      colorMuted: "#5f6b7a",
      colorBorder: "#d9e2ec",
      accent: "#2563eb",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontMono: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
      contentWidth: "76ch",
      spacing: "1.15rem",
      radius: "8px",
      shadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
      animation: "180ms ease"
    }
  },
  minimal: {
    name: "minimal",
    tokens: {
      colorBackground: "#ffffff",
      colorSurface: "#ffffff",
      colorText: "#18181b",
      colorMuted: "#71717a",
      colorBorder: "#e4e4e7",
      accent: "#111827",
      fontBody: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontMono: "ui-monospace, 'SFMono-Regular', Consolas, monospace",
      contentWidth: "72ch",
      spacing: "1rem",
      radius: "2px",
      shadow: "none",
      animation: "120ms ease"
    }
  },
    github: {

    name: "github",

    tokens: {

      colorBackground: "#ffffff",

      colorSurface: "#f6f8fa",

      colorText: "#24292f",

      colorMuted: "#57606a",

      colorBorder: "#d0d7de",

      accent: "#0969da",

      fontBody: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",

      fontMono: "ui-monospace, 'SFMono-Regular', 'SF Mono', Consolas, monospace",

      contentWidth: "88ch",

      spacing: "1rem",

      radius: "6px",

      shadow: "none",

      animation: "120ms ease"

    }

  }, 


  githubDark: {
    name: "github-dark",
    tokens: {
       colorBackground: "#0d1117",
    colorSurface: "#161b22",
    colorText: "#e6edf3",
    colorMuted: "#8d96a0",
    colorBorder: "#30363d",
    accent: "#2f81f7",
    fontBody: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    fontMono: "ui-monospace, 'SFMono-Regular', 'SF Mono', Consolas, monospace",
    contentWidth: "88ch",
    spacing: "1rem",
    radius: "6px",
    shadow: "none",
    animation: "120ms ease"
    }
  },
  glass: {
    name: "glass",
    tokens: {
      colorBackground: "#eef5ff",
      colorSurface: "rgba(255, 255, 255, 0.72)",
      colorText: "#102033",
      colorMuted: "#516174",
      colorBorder: "rgba(82, 113, 152, 0.24)",
      accent: "#0ea5e9",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontMono: "'SFMono-Regular', Consolas, monospace",
      contentWidth: "78ch",
      spacing: "1.2rem",
      radius: "8px",
      shadow: "0 24px 70px rgba(35, 71, 112, 0.18)",
      animation: "220ms ease"
    }
  },
  liquidGlass: {
  name: "liquid-glass",
  tokens: {
    colorBackground: "linear-gradient(135deg, #020514 0%, #0d0f26 50%, #1a103c 100%)",
    colorSurface: "rgba(255, 255, 255, 0.08)",
    colorText: "#ffffff",
    colorMuted: "rgba(255, 255, 255, 0.55)",
    colorBorder: "rgba(255, 255, 255, 0.15)",
    accent: "#3af2b1",
    fontBody: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontMono: "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    contentWidth: "78ch",
    spacing: "1.2rem",
    radius: "28px",
    shadow: "0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 40px rgba(58, 242, 177, 0.1)",
    animation: "380ms cubic-bezier(0.16, 1, 0.3, 1)"
  }
},
vscodeDark: {
  name: "vscode-dark",
  tokens: {
    colorBackground: "#1e1e1e",
    colorSurface: "#252526",
    colorText: "#d4d4d4",
    colorMuted: "#858585",
    colorBorder: "#3c3c3c",
    accent: "#007acc",
    fontBody: "{ 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif }",
    fontMono: "Consolas, 'Courier New', monospace",
    contentWidth: "80ch",
    spacing: "1rem",
    radius: "0px",
    shadow: "none",
    animation: "100ms ease-out"
  }
},
cartoon: {
  name: "cartoon",
  tokens: {
    colorBackground: "#fef08a",
    colorSurface: "#ffffff",
    colorText: "#000000",
    colorMuted: "#4b5563",
    colorBorder: "#000000",
    accent: "#ec4899",
    fontBody: "'Comic Neue', 'Chalkboard SE', 'Comic Sans MS', cursive, sans-serif",
    fontMono: "'Courier New', Courier, monospace",
    contentWidth: "75ch",
    spacing: "1.5rem",
    radius: "16px",
    shadow: "8px 8px 0px #000000",
    animation: "150ms cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  }
},
  corporate: {
    name: "corporate",
    tokens: {
      colorBackground: "#f7f8fb",
      colorSurface: "#ffffff",
      colorText: "#1f2937",
      colorMuted: "#64748b",
      colorBorder: "#d7dde8",
      accent: "#1d4ed8",
      fontBody: "Aptos, Calibri, 'Segoe UI', system-ui, sans-serif",
      fontMono: "Cascadia Mono, Consolas, monospace",
      contentWidth: "82ch",
      spacing: "1.05rem",
      radius: "6px",
      shadow: "0 12px 36px rgba(31, 41, 55, 0.08)",
      animation: "160ms ease"
    }
  },
retro: {
  name: "retro",
  tokens: {
    colorBackground: "#080810",
    colorSurface: "#101028",
    colorText: "#ffffff",
    colorMuted: "#a0a0ba",
    colorBorder: "#ffffff",
    accent: "#f8b800",
    fontBody: "'Press Start 2P', 'Courier New', Courier, monospace",
    fontMono: "'Press Start 2P', 'Courier New', Courier, monospace",
    contentWidth: "70ch",
    spacing: "1.5rem",
    radius: "0px",
    shadow: "4px 4px 0px #000000, inset -4px -4px 0px #000000, inset 4px 4px 0px #ffffff",
    animation: "0s none"
  }
}   
};

export const accentColors = {
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  violet: "#7c3aed",
  slate: "#334155"
};

export const fontTokens = {
  inter: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  system: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, 'SFMono-Regular', Consolas, monospace"
};

export function resolveTheme(metadata = {}, customThemes = []) {
  const registry = { ...builtInThemes };
  for (const theme of customThemes) {
    registry[theme.name] = theme;
  }

  const requestedName = metadata.theme || "modern";
  const requested = registry[requestedName] || registry.modern;
  const parent = requested.extends ? registry[requested.extends] || registry.modern : null;
  const tokens = {
    ...(parent?.tokens || {}),
    ...requested.tokens
  };

  if (metadata.accent) {
    tokens.accent = accentColors[metadata.accent] || metadata.accent;
  }

  if (metadata.font) {
    tokens.fontBody = fontTokens[metadata.font] || metadata.font;
  }

  return {
    name: requested.name,
    tokens
  };
}

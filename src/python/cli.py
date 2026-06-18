#!/usr/bin/env python3
"""Command-line interface for rendering .bmd/.md files to HTML (ported from cli.js)."""

import os
import sys

from bmd import render


HELP_MESSAGE = """Beautiful Markdown CLI

Usage:
  bmd <input.bmd|input.md> <output.html> [options]

Options:
  --theme <path>    Load custom theme from JSON file (can be used multiple times)
  -h, --help        Show this help message

Examples:
  bmd article.bmd article.html
  bmd article.bmd article.html --theme ./theme.json
  bmd article.bmd article.html --theme theme1.json --theme theme2.json
"""

def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]

    if len(argv) == 0 or argv[0] in ("-h", "--help", "help"):
        print(HELP_MESSAGE)
        sys.exit(0 if argv else 1)

    if len(argv) < 2:
        print(
            "Usage: bmd <input.bmd|input.md> <output.html> [--theme path/to/theme.json]",
            file=sys.stderr,
        )
        print("Use 'bmd --help' for more information", file=sys.stderr)
        sys.exit(1)

    input_path, output_path, *rest = argv

    custom_themes = []
    i = 0
    while i < len(rest):
        if rest[i] == "--theme" and i + 1 < len(rest):
            custom_themes.append(rest[i + 1])
            i += 2
        else:
            i += 1

    with open(input_path, "r", encoding="utf8") as f:
        source = f.read()

    html = render(source, {"customThemes": custom_themes})

    output_dir = os.path.dirname(output_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    with open(output_path, "w", encoding="utf8") as f:
        f.write(html)

    print(f"Rendered {input_path} -> {output_path}")


if __name__ == "__main__":
    main()

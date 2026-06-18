# Beautiful Markdown Grammar

BMD delegates Markdown block and inline grammar to CommonMark. Its own grammar covers the document envelope and frontmatter.

```ebnf
BmdDocument     ::= Frontmatter? MarkdownBody

Frontmatter     ::= FrontmatterOpen FrontmatterEntry* FrontmatterClose
FrontmatterOpen ::= "---" LineEnding
FrontmatterClose::= "---" LineEnding

FrontmatterEntry::= Key ":" Value? LineEnding
Key             ::= Letter (Letter | Digit | "_" | "-")*
Value           ::= QuotedString | BareString | Number | Boolean

MarkdownBody    ::= (CommonMarkBlock | DirectiveBlock)*

DirectiveBlock  ::= DirectiveOpen DirectiveBody DirectiveClose
DirectiveOpen   ::= ":::" ComponentName Modifier* LineEnding
DirectiveClose  ::= ":::" LineEnding
ComponentName   ::= Letter (Letter | Digit | "-" | "_")*
Modifier        ::= Space BareString
DirectiveBody   ::= (CommonMarkBlock | DirectiveBlock | ComponentMarker)*

InlineCommand   ::= "[" CommandName Modifier* "]" Space InlineText
CommandName     ::= "button"
```

## CommonMark Delegation

The `CommonMarkDocument` production includes the CommonMark grammar for:

- ATX and Setext headings
- Paragraphs
- Emphasis and strong emphasis
- Links and images
- Ordered and unordered lists
- Blockquotes
- Indented and fenced code blocks
- HTML blocks and inline HTML
- Thematic breaks
- Code spans

## Tables

Tables follow the GitHub Flavored Markdown table extension:

```ebnf
Table           ::= HeaderRow DelimiterRow BodyRow*
HeaderRow       ::= PipeRow
DelimiterRow    ::= CellDelimiter ("|" CellDelimiter)*
CellDelimiter   ::= ":---" | "---:" | ":---:" | "---"
BodyRow         ::= PipeRow
PipeRow         ::= "|" Cell ("|" Cell)* "|"?
```

Tables are the only non-CommonMark Markdown syntax included by default because they are expected in modern documents.

## Component Markers

```ebnf
AccordionItem   ::= "?" Space InlineText LineEnding MarkdownBody
TabItem         ::= "@tab" Space InlineText LineEnding MarkdownBody
```

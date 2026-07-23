// Lightweight, dependency-free markdown → block/inline AST parser for ZyraMarkdownViewer.
// Not CommonMark-complete — covers headings, paragraphs, bold/italic, links, images, inline
// code, fenced code blocks, ordered/unordered lists (flat, no nesting), blockquotes, tables,
// and horizontal rules. Good enough for docs/README-style content, not an arbitrary CMS body.

export type MdInlineSpan =
    | { type: 'text'; text: string }
    | { type: 'bold'; text: string }
    | { type: 'italic'; text: string }
    | { type: 'code'; text: string }
    | { type: 'link'; text: string; href: string }
    | { type: 'image'; alt: string; src: string };

export type MdTableAlign = 'left' | 'center' | 'right' | null;

export type MdBlock =
    | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; spans: MdInlineSpan[] }
    | { type: 'paragraph'; spans: MdInlineSpan[] }
    | { type: 'blockquote'; spans: MdInlineSpan[] }
    | { type: 'list'; ordered: boolean; items: MdInlineSpan[][] }
    | { type: 'code'; code: string; language: string }
    | { type: 'hr' }
    | { type: 'table'; align: MdTableAlign[]; header: MdInlineSpan[][]; rows: MdInlineSpan[][][] };

const INLINE_RE =
    /!\[(?<imgAlt>[^\]]*)\]\((?<imgSrc>[^)]+)\)|\[(?<linkText>[^\]]*)\]\((?<linkHref>[^)]+)\)|\*\*(?<boldStar>[^*]+)\*\*|__(?<boldUnd>[^_]+)__|\*(?<italStar>[^*]+)\*|_(?<italUnd>[^_]+)_|`(?<codeText>[^`]+)`|<(?<htmlTag>[^>]+)>/g;

export function parseInline(text: string, sanitize: boolean): MdInlineSpan[] {
    const spans: MdInlineSpan[] = [];
    let lastIndex = 0;

    for (const m of text.matchAll(INLINE_RE)) {
        if (m.index > lastIndex) {
            spans.push({ type: 'text', text: text.slice(lastIndex, m.index) });
        }
        const g = m.groups!;
        if (g['imgSrc'] !== undefined) {
            spans.push({ type: 'image', alt: g['imgAlt'] ?? '', src: g['imgSrc'] });
        } else if (g['linkHref'] !== undefined) {
            spans.push({ type: 'link', text: g['linkText'] ?? '', href: g['linkHref'] });
        } else if (g['boldStar'] !== undefined) {
            spans.push({ type: 'bold', text: g['boldStar'] });
        } else if (g['boldUnd'] !== undefined) {
            spans.push({ type: 'bold', text: g['boldUnd'] });
        } else if (g['italStar'] !== undefined) {
            spans.push({ type: 'italic', text: g['italStar'] });
        } else if (g['italUnd'] !== undefined) {
            spans.push({ type: 'italic', text: g['italUnd'] });
        } else if (g['codeText'] !== undefined) {
            spans.push({ type: 'code', text: g['codeText'] });
        } else if (g['htmlTag'] !== undefined && !sanitize) {
            spans.push({ type: 'text', text: m[0] });
        }
        // sanitize === true and htmlTag matched: dropped entirely (no push).
        lastIndex = m.index + m[0].length;
    }
    if (lastIndex < text.length) {
        spans.push({ type: 'text', text: text.slice(lastIndex) });
    }
    return spans;
}

function splitTableRow(line: string): string[] {
    let s = line.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);
    return s.split('|');
}

const FENCE_RE = /^```\s*([\w-]*)\s*$/;
const HR_RE = /^ {0,3}([-*_])( *\1){2,} *$/;
const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const BLOCKQUOTE_RE = /^>\s?/;
const UNORDERED_ITEM_RE = /^\s*[-*+]\s+(.*)$/;
const ORDERED_ITEM_RE = /^\s*\d+\.\s+(.*)$/;
const TABLE_DELIM_RE = /^\s*\|?[\s:|-]+\|?\s*$/;

export function parseMarkdown(content: string, sanitize = true): MdBlock[] {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const blocks: MdBlock[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.trim() === '') {
            i++;
            continue;
        }

        const fence = line.match(FENCE_RE);
        if (fence) {
            const language = fence[1] ?? '';
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !/^```\s*$/.test(lines[i])) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // skip the closing fence line
            blocks.push({ type: 'code', code: codeLines.join('\n'), language });
            continue;
        }

        if (HR_RE.test(line)) {
            blocks.push({ type: 'hr' });
            i++;
            continue;
        }

        const heading = line.match(HEADING_RE);
        if (heading) {
            blocks.push({
                type: 'heading',
                level: heading[1].length as 1 | 2 | 3 | 4 | 5 | 6,
                spans: parseInline(heading[2].trim(), sanitize),
            });
            i++;
            continue;
        }

        if (
            line.includes('|') &&
            i + 1 < lines.length &&
            lines[i + 1].includes('-') &&
            TABLE_DELIM_RE.test(lines[i + 1])
        ) {
            const headerCells = splitTableRow(line);
            const delimCells = splitTableRow(lines[i + 1]);
            const align: MdTableAlign[] = delimCells.map((cell) => {
                const t = cell.trim();
                const left = t.startsWith(':');
                const right = t.endsWith(':');
                if (left && right) return 'center';
                if (right) return 'right';
                if (left) return 'left';
                return null;
            });
            i += 2;
            const rows: MdInlineSpan[][][] = [];
            while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
                rows.push(splitTableRow(lines[i]).map((c) => parseInline(c.trim(), sanitize)));
                i++;
            }
            blocks.push({
                type: 'table',
                align,
                header: headerCells.map((c) => parseInline(c.trim(), sanitize)),
                rows,
            });
            continue;
        }

        if (BLOCKQUOTE_RE.test(line)) {
            const quoteLines: string[] = [];
            while (i < lines.length && BLOCKQUOTE_RE.test(lines[i])) {
                quoteLines.push(lines[i].replace(BLOCKQUOTE_RE, ''));
                i++;
            }
            blocks.push({ type: 'blockquote', spans: parseInline(quoteLines.join(' '), sanitize) });
            continue;
        }

        const isOrderedStart = ORDERED_ITEM_RE.test(line);
        const isUnorderedStart = UNORDERED_ITEM_RE.test(line);
        if (isOrderedStart || isUnorderedStart) {
            const ordered = isOrderedStart;
            const itemRe = ordered ? ORDERED_ITEM_RE : UNORDERED_ITEM_RE;
            const items: MdInlineSpan[][] = [];
            while (i < lines.length) {
                const m = lines[i].match(itemRe);
                if (!m) break;
                items.push(parseInline(m[1], sanitize));
                i++;
            }
            blocks.push({ type: 'list', ordered, items });
            continue;
        }

        const paraLines: string[] = [];
        while (
            i < lines.length &&
            lines[i].trim() !== '' &&
            !FENCE_RE.test(lines[i]) &&
            !HEADING_RE.test(lines[i]) &&
            !BLOCKQUOTE_RE.test(lines[i]) &&
            !UNORDERED_ITEM_RE.test(lines[i]) &&
            !ORDERED_ITEM_RE.test(lines[i]) &&
            !HR_RE.test(lines[i])
        ) {
            paraLines.push(lines[i]);
            i++;
        }
        blocks.push({ type: 'paragraph', spans: parseInline(paraLines.join(' '), sanitize) });
    }

    return blocks;
}

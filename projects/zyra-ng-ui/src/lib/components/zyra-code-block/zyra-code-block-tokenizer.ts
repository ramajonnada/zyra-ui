// Lightweight, dependency-free syntax tokenizer for ZyraCodeBlock.
// Not a full parser — good enough for docs/marketing code samples, not a language server.

export type ZyraCodeTokenType =
    | 'plain'
    | 'keyword'
    | 'string'
    | 'comment'
    | 'number'
    | 'tag'
    | 'attr'
    | 'punct';

export interface ZyraCodeToken {
    type: ZyraCodeTokenType;
    text: string;
}

interface ScanState {
    inBlockComment: boolean;
    inTag: boolean;
}

interface Rule {
    type: ZyraCodeTokenType;
    re: RegExp;
    when?: (state: ScanState) => boolean;
    onMatch?: (state: ScanState, text: string) => void;
}

const JS_KEYWORDS =
    /^\b(?:import|export|default|from|function|return|const|let|var|if|else|for|while|do|class|extends|new|typeof|interface|type|as|async|await|of|in|switch|case|break|continue|try|catch|finally|throw|null|undefined|true|false|void|this|super|public|private|protected|readonly|implements|enum|namespace|declare|yield|delete|instanceof|static|get|set)\b/;

const jsRules: Rule[] = [
    { type: 'string', re: /^`(?:\\.|[^`\\])*`|^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/ },
    {
        type: 'tag',
        re: /^<\/?[A-Za-z][\w.]*/,
        onMatch: (state) => {
            state.inTag = true;
        },
    },
    {
        type: 'attr',
        re: /^[A-Za-z_][\w-]*(?=\s*=(?!=))/,
        when: (state) => state.inTag,
    },
    { type: 'keyword', re: JS_KEYWORDS },
    { type: 'number', re: /^\b\d+(?:\.\d+)?\b/ },
    {
        type: 'punct',
        re: /^[{}()[\].,;:=+\-*/%!?&|~^<>]/,
        onMatch: (state, text) => {
            if (text === '>') {
                state.inTag = false;
            }
        },
    },
];

const cssRules: Rule[] = [
    { type: 'string', re: /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/ },
    { type: 'keyword', re: /^@[\w-]+/ },
    { type: 'number', re: /^#[0-9a-fA-F]{3,8}\b|^\b\d+(?:\.\d+)?(?:%|[a-z]+)?\b/ },
    { type: 'attr', re: /^[.#]?[A-Za-z-][\w-]*(?=\s*:)/ },
    { type: 'punct', re: /^[{}()[\]:;,.#>~+*]/ },
];

const htmlRules: Rule[] = [
    { type: 'string', re: /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/ },
    {
        type: 'tag',
        re: /^<\/?[A-Za-z][\w-]*/,
        onMatch: (state) => {
            state.inTag = true;
        },
    },
    {
        type: 'attr',
        re: /^[A-Za-z-][\w-]*(?=\s*=)/,
        when: (state) => state.inTag,
    },
    {
        type: 'punct',
        re: /^[<>=/]/,
        onMatch: (state, text) => {
            if (text === '>') {
                state.inTag = false;
            }
        },
    },
];

const jsonRules: Rule[] = [
    { type: 'attr', re: /^"(?:\\.|[^"\\])*"(?=\s*:)/ },
    { type: 'string', re: /^"(?:\\.|[^"\\])*"/ },
    { type: 'keyword', re: /^\b(?:true|false|null)\b/ },
    { type: 'number', re: /^-?\b\d+(?:\.\d+)?\b/ },
    { type: 'punct', re: /^[{}[\]:,]/ },
];

const bashRules: Rule[] = [
    { type: 'comment', re: /^#.*/ },
    { type: 'string', re: /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/ },
    { type: 'attr', re: /^\$\{?\w+\}?|^--?[\w-]+/ },
    { type: 'punct', re: /^[|&;()<>]/ },
];

const mdRules: Rule[] = [
    { type: 'keyword', re: /^#{1,6}\s.*/ },
    { type: 'string', re: /^`[^`]*`/ },
    { type: 'punct', re: /^[*_>#-]/ },
];

function scanLine(text: string, rules: Rule[], state: ScanState, lineComment: string | null): ZyraCodeToken[] {
    const tokens: ZyraCodeToken[] = [];
    let pos = 0;

    while (pos < text.length) {
        const rest = text.slice(pos);

        if (state.inBlockComment) {
            const end = rest.indexOf('*/');
            if (end === -1) {
                tokens.push({ type: 'comment', text: rest });
                pos = text.length;
            } else {
                tokens.push({ type: 'comment', text: rest.slice(0, end + 2) });
                pos += end + 2;
                state.inBlockComment = false;
            }
            continue;
        }

        if (lineComment && rest.startsWith(lineComment)) {
            tokens.push({ type: 'comment', text: rest });
            pos = text.length;
            continue;
        }

        if (rest.startsWith('/*')) {
            const end = rest.indexOf('*/', 2);
            if (end === -1) {
                tokens.push({ type: 'comment', text: rest });
                state.inBlockComment = true;
                pos = text.length;
            } else {
                tokens.push({ type: 'comment', text: rest.slice(0, end + 2) });
                pos += end + 2;
            }
            continue;
        }

        let matched = false;
        for (const rule of rules) {
            if (rule.when && !rule.when(state)) {
                continue;
            }
            const m = rest.match(rule.re);
            if (m && m[0].length > 0) {
                tokens.push({ type: rule.type, text: m[0] });
                pos += m[0].length;
                rule.onMatch?.(state, m[0]);
                matched = true;
                break;
            }
        }
        if (matched) {
            continue;
        }

        const ws = rest.match(/^\s+/);
        if (ws) {
            tokens.push({ type: 'plain', text: ws[0] });
            pos += ws[0].length;
            continue;
        }
        const id = rest.match(/^[\w$]+/);
        if (id) {
            tokens.push({ type: 'plain', text: id[0] });
            pos += id[0].length;
            continue;
        }
        tokens.push({ type: 'plain', text: rest[0] });
        pos += 1;
    }

    return mergeAdjacent(tokens);
}

function mergeAdjacent(tokens: ZyraCodeToken[]): ZyraCodeToken[] {
    const merged: ZyraCodeToken[] = [];
    for (const tok of tokens) {
        const prev = merged[merged.length - 1];
        if (prev && prev.type === tok.type) {
            prev.text += tok.text;
        } else {
            merged.push({ ...tok });
        }
    }
    return merged;
}

type LangFamily = 'js' | 'css' | 'html' | 'json' | 'bash' | 'md' | 'plain';

const LANG_ALIASES: Record<string, LangFamily> = {
    js: 'js',
    jsx: 'js',
    ts: 'js',
    tsx: 'js',
    javascript: 'js',
    typescript: 'js',
    css: 'css',
    scss: 'css',
    less: 'css',
    html: 'html',
    xml: 'html',
    svg: 'html',
    json: 'json',
    bash: 'bash',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    md: 'md',
    markdown: 'md',
};

function resolveFamily(language: string): LangFamily {
    return LANG_ALIASES[language.trim().toLowerCase()] ?? 'plain';
}

/** Tokenizes every line of `code` for the given `language`, threading lexer state across lines. */
export function tokenizeCode(code: string, language: string): ZyraCodeToken[][] {
    const family = resolveFamily(language);
    const lines = code.replace(/\n$/, '').split('\n');

    if (family === 'plain') {
        return lines.map((line) => [{ type: 'plain' as const, text: line }]);
    }

    const state: ScanState = { inBlockComment: false, inTag: false };
    const rules = { js: jsRules, css: cssRules, html: htmlRules, json: jsonRules, bash: bashRules, md: mdRules }[
        family
    ];
    const lineComment = family === 'js' ? '//' : family === 'css' ? '//' : null;

    return lines.map((line) => scanLine(line, rules, state, lineComment));
}

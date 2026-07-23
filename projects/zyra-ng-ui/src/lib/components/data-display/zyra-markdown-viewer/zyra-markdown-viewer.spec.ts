import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraMarkdownViewer } from './zyra-markdown-viewer';
import { parseMarkdown } from './zyra-markdown-viewer-parser';

describe('parseMarkdown', () => {
    it('parses headings 1-6', () => {
        const blocks = parseMarkdown('# H1\n## H2\n###### H6');
        expect(blocks).toEqual([
            { type: 'heading', level: 1, spans: [{ type: 'text', text: 'H1' }] },
            { type: 'heading', level: 2, spans: [{ type: 'text', text: 'H2' }] },
            { type: 'heading', level: 6, spans: [{ type: 'text', text: 'H6' }] },
        ]);
    });

    it('parses a paragraph with bold, italic, code, and a link', () => {
        const blocks = parseMarkdown('Hello **world**, this is *nice* and `code` and [a link](https://x.com).');
        expect(blocks.length).toBe(1);
        expect(blocks[0].type).toBe('paragraph');
        const spans = (blocks[0] as { spans: unknown[] }).spans;
        expect(spans).toContain(jasmine.objectContaining({ type: 'bold', text: 'world' }));
        expect(spans).toContain(jasmine.objectContaining({ type: 'italic', text: 'nice' }));
        expect(spans).toContain(jasmine.objectContaining({ type: 'code', text: 'code' }));
        expect(spans).toContain(jasmine.objectContaining({ type: 'link', text: 'a link', href: 'https://x.com' }));
    });

    it('parses an image span', () => {
        const blocks = parseMarkdown('![alt text](/img.png)');
        const spans = (blocks[0] as { spans: unknown[] }).spans;
        expect(spans).toEqual([{ type: 'image', alt: 'alt text', src: '/img.png' }]);
    });

    it('parses a fenced code block with a language', () => {
        const blocks = parseMarkdown('```ts\nconst x = 1;\n```');
        expect(blocks).toEqual([{ type: 'code', code: 'const x = 1;', language: 'ts' }]);
    });

    it('parses an unordered list', () => {
        const blocks = parseMarkdown('- one\n- two\n- three');
        expect(blocks.length).toBe(1);
        expect(blocks[0].type).toBe('list');
        const list = blocks[0] as { ordered: boolean; items: unknown[] };
        expect(list.ordered).toBeFalse();
        expect(list.items.length).toBe(3);
    });

    it('parses an ordered list', () => {
        const blocks = parseMarkdown('1. one\n2. two');
        const list = blocks[0] as { ordered: boolean; items: unknown[] };
        expect(list.ordered).toBeTrue();
        expect(list.items.length).toBe(2);
    });

    it('parses a blockquote', () => {
        const blocks = parseMarkdown('> quoted text');
        expect(blocks[0].type).toBe('blockquote');
    });

    it('parses a horizontal rule', () => {
        expect(parseMarkdown('---')).toEqual([{ type: 'hr' }]);
        expect(parseMarkdown('***')).toEqual([{ type: 'hr' }]);
    });

    it('parses a table with alignment', () => {
        const blocks = parseMarkdown('| A | B |\n|:---|---:|\n| 1 | 2 |');
        expect(blocks.length).toBe(1);
        const table = blocks[0] as { type: string; align: (string | null)[]; header: unknown[]; rows: unknown[][] };
        expect(table.type).toBe('table');
        expect(table.align).toEqual(['left', 'right']);
        expect(table.header.length).toBe(2);
        expect(table.rows.length).toBe(1);
    });

    it('separates multiple blocks by blank lines', () => {
        const blocks = parseMarkdown('# Title\n\nSome text.\n\n- a\n- b');
        expect(blocks.map((b) => b.type)).toEqual(['heading', 'paragraph', 'list']);
    });

    // ── Sanitize ──────────────────────────────────────────────────────────
    it('strips raw HTML-looking tags when sanitize is true (default)', () => {
        const blocks = parseMarkdown('before <script>alert(1)</script> after');
        const spans = (blocks[0] as { spans: { type: string; text?: string }[] }).spans;
        const joined = spans.map((s) => s.text ?? '').join('');
        expect(joined).not.toContain('<script>');
    });

    it('keeps raw HTML-looking tags as literal text when sanitize is false', () => {
        const blocks = parseMarkdown('before <b>bold-ish</b> after', false);
        const spans = (blocks[0] as { spans: { type: string; text?: string }[] }).spans;
        const joined = spans.map((s) => s.text ?? '').join('');
        expect(joined).toContain('<b>');
    });
});

describe('ZyraMarkdownViewer (component)', () => {
    @Component({
        standalone: true,
        imports: [ZyraMarkdownViewer],
        template: `<zyra-markdown-viewer [content]="content()" [sanitize]="sanitize()" [linkTarget]="linkTarget()" />`,
    })
    class HostComponent {
        content = signal('# Title\n\nSome **bold** text with a [link](https://example.com).');
        sanitize = signal(true);
        linkTarget = signal<'_blank' | '_self'>('_blank');
    }

    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('renders a heading and paragraph with inline formatting', () => {
        const root: HTMLElement = fixture.nativeElement;
        expect(root.querySelector('.zyr-md__h1')?.textContent?.trim()).toBe('Title');
        expect(root.querySelector('.zyr-md__p strong')?.textContent).toBe('bold');
    });

    it('renders a link with the configured target and rel', () => {
        const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.zyr-md__p a');
        expect(a.getAttribute('href')).toBe('https://example.com');
        expect(a.getAttribute('target')).toBe('_blank');
        expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('omits rel when linkTarget is _self', () => {
        fixture.componentInstance.linkTarget.set('_self');
        fixture.detectChanges();
        const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.zyr-md__p a');
        expect(a.getAttribute('target')).toBe('_self');
        expect(a.getAttribute('rel')).toBeNull();
    });

    it('renders fenced code blocks via zyra-code-block', () => {
        fixture.componentInstance.content.set('```js\nconsole.log(1);\n```');
        fixture.detectChanges();
        const codeBlock = fixture.nativeElement.querySelector('zyra-code-block');
        expect(codeBlock).not.toBeNull();
        expect(codeBlock.textContent).toContain('console.log(1);');
    });

    it('renders a table', () => {
        fixture.componentInstance.content.set('| A | B |\n|---|---|\n| 1 | 2 |');
        fixture.detectChanges();
        const table: HTMLTableElement = fixture.nativeElement.querySelector('.zyr-md__table');
        expect(table).not.toBeNull();
        expect(table.querySelectorAll('th').length).toBe(2);
        expect(table.querySelectorAll('td').length).toBe(2);
    });
});

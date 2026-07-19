import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraCodeBlock } from './zyra-code-block';

@Component({
    standalone: true,
    imports: [ZyraCodeBlock],
    template: `
        <zyra-code-block
            [code]="code()"
            [language]="language()"
            [filename]="filename()"
            [lineNumbers]="lineNumbers()"
            [copyable]="copyable()"
        />
    `,
})
class CodeBlockHostComponent {
    code = signal('const a = 1;\nconst b = 2;');
    language = signal('');
    filename = signal('');
    lineNumbers = signal(false);
    copyable = signal(true);
}

describe('ZyraCodeBlock', () => {
    let fixture: ComponentFixture<CodeBlockHostComponent>;
    let host: CodeBlockHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [CodeBlockHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(CodeBlockHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Content ───────────────────────────────────────────────────────────
    it('renders each line of code', () => {
        const lines = fixture.nativeElement.querySelectorAll('.zyr-code-block__line-content');
        expect(lines.length).toBe(2);
        expect(lines[0].textContent).toContain('const a = 1;');
        expect(lines[1].textContent).toContain('const b = 2;');
    });

    // ── Header ────────────────────────────────────────────────────────────
    it('shows header when copyable is true by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-code-block__header')).not.toBeNull();
    });

    it('hides header when copyable, filename, and language are all empty', () => {
        host.copyable.set(false);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-code-block__header')).toBeNull();
    });

    it('renders filename when provided', () => {
        host.filename.set('app.ts');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-code-block__filename').textContent).toContain(
            'app.ts',
        );
    });

    it('renders language when provided', () => {
        host.language.set('typescript');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-code-block__lang').textContent).toContain(
            'typescript',
        );
    });

    // ── Line numbers ──────────────────────────────────────────────────────
    it('does not render line numbers by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-code-block__line-number')).toBeNull();
    });

    it('renders line numbers when enabled', () => {
        host.lineNumbers.set(true);
        fixture.detectChanges();
        const numbers = fixture.nativeElement.querySelectorAll('.zyr-code-block__line-number');
        expect(numbers.length).toBe(2);
        expect(numbers[0].textContent).toContain('1');
        expect(numbers[1].textContent).toContain('2');
    });

    // ── Syntax highlighting ───────────────────────────────────────────────
    it('tokenizes keywords and strings when a language is set', () => {
        host.language.set('typescript');
        host.code.set(`import { a } from 'b';`);
        fixture.detectChanges();
        const keywords: NodeListOf<Element> = fixture.nativeElement.querySelectorAll(
            '.zyr-code-block__tok--keyword',
        );
        const strings = fixture.nativeElement.querySelectorAll('.zyr-code-block__tok--string');
        expect(Array.from(keywords).map((el) => el.textContent)).toEqual(['import', 'from']);
        expect(strings[0].textContent).toBe(`'b'`);
    });

    it('renders each line as a single plain token when no language is set', () => {
        const tokens = fixture.nativeElement.querySelectorAll('.zyr-code-block__tok--plain');
        expect(tokens.length).toBe(2);
        expect(tokens[0].textContent).toBe('const a = 1;');
    });

    // ── Copy ──────────────────────────────────────────────────────────────
    it('copies code to clipboard and shows confirmation', async () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: jasmine.createSpy().and.resolveTo(undefined) },
            configurable: true,
        });
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-code-block__copy');
        button.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const a = 1;\nconst b = 2;');
        expect(button.classList).toContain('zyr-code-block__copy--copied');
    });

    it('does not render copy button when copyable is false', () => {
        host.copyable.set(false);
        host.filename.set('app.ts');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-code-block__copy')).toBeNull();
    });
});

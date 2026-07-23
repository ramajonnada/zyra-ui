import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraJsonViewer } from './zyra-json-viewer';

@Component({
    standalone: true,
    imports: [ZyraJsonViewer],
    template: `<zyra-json-viewer [data]="data()" [expandDepth]="expandDepth()" [maxDepth]="maxDepth()" [copyable]="copyable()" />`,
})
class JsonViewerHostComponent {
    data = signal<unknown>({ name: 'Ava', active: true, tags: ['a', 'b'], meta: { age: 30 }, note: null });
    expandDepth = signal(1);
    maxDepth = signal(20);
    copyable = signal(true);
}

describe('ZyraJsonViewer', () => {
    let fixture: ComponentFixture<JsonViewerHostComponent>;
    let host: JsonViewerHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [JsonViewerHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(JsonViewerHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    function rows(): HTMLElement[] {
        return Array.from(fixture.nativeElement.querySelectorAll('.zyr-json-viewer__row'));
    }

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders one row per top-level key at depth 0', () => {
        // root object row + 5 property rows expanded (expandDepth=1 opens root)
        expect(rows().length).toBe(6);
    });

    it('shows primitive values with their formatted preview', () => {
        const text = fixture.nativeElement.textContent;
        expect(text).toContain('"Ava"');
        expect(text).toContain('true');
        expect(text).toContain('null');
    });

    it('shows a collapsed container preview like {1} for nested objects beyond expandDepth', () => {
        const text = fixture.nativeElement.textContent;
        expect(text).toContain('{1}');
    });

    // ── Expand / collapse ────────────────────────────────────────────────
    it('expands a collapsed container node when its toggle is clicked', () => {
        const toggles: HTMLElement[] = Array.from(
            fixture.nativeElement.querySelectorAll('.zyr-json-viewer__toggle'),
        );
        const metaToggle = toggles.find((t) => t.closest('.zyr-json-viewer__row')?.textContent?.includes('meta'));
        expect(metaToggle).toBeDefined();
        const before = rows().length;
        metaToggle!.click();
        fixture.detectChanges();
        expect(rows().length).toBe(before + 1);
        expect(fixture.nativeElement.textContent).toContain('age');
    });

    it('does not render a toggle for empty containers or primitives', () => {
        host.data.set({ empty: {}, num: 1 });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.zyr-json-viewer__toggle').length).toBe(1);
    });

    // ── expandDepth ───────────────────────────────────────────────────────
    it('collapses everything when expandDepth is 0', () => {
        host.expandDepth.set(0);
        fixture.detectChanges();
        expect(rows().length).toBe(1);
        expect(fixture.nativeElement.textContent).toContain('{5}');
    });

    // ── maxDepth safety cap ───────────────────────────────────────────────
    it('hides the toggle and stops recursing once maxDepth is reached', () => {
        host.data.set({ a: { b: { c: { d: 1 } } } });
        host.expandDepth.set(10);
        host.maxDepth.set(2);
        fixture.detectChanges();
        // depths: 0 (root {a}), 1 (a: {b}) -> toggle hidden at depth 2 (b: {c})
        const text = fixture.nativeElement.textContent;
        expect(text).toContain('{1}');
        expect(fixture.nativeElement.querySelectorAll('.zyr-json-viewer__toggle').length).toBe(2);
    });

    // ── String input parsing ─────────────────────────────────────────────
    it('parses a raw JSON string when data is a string', () => {
        host.data.set('{"a":1,"b":2}');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-json-viewer__error')).toBeNull();
        expect(rows().length).toBe(3);
    });

    it('shows an error message for invalid JSON strings', () => {
        host.data.set('{not valid json');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-json-viewer__error')).not.toBeNull();
        expect(rows().length).toBe(0);
    });

    // ── Copy ──────────────────────────────────────────────────────────────
    it('shows a copy button when copyable is true', () => {
        expect(fixture.nativeElement.querySelector('.zyr-json-viewer__copy')).not.toBeNull();
    });

    it('hides the copy button when copyable is false', () => {
        host.copyable.set(false);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-json-viewer__copy')).toBeNull();
    });

    it('copies formatted JSON to the clipboard and shows a copied state', async () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: jasmine.createSpy().and.resolveTo(undefined) },
            configurable: true,
        });
        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-json-viewer__copy');
        btn.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify(host.data(), null, 2));
        expect(fixture.nativeElement.querySelector('.zyr-json-viewer__copy--copied')).not.toBeNull();
    });
});

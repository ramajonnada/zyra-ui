import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    ZyraBox,
    BoxBackground,
    BoxCursor,
    BoxDisplay,
    BoxOverflow,
    BoxPosition,
    BoxRadius,
    BoxShadow,
    BoxSpacing,
    BoxUserSelect,
} from './zyra-box';

// ── Host fixtures ─────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [ZyraBox],
    template: `
        <zyra-box
            [display]="display()"
            [padding]="padding()"
            [paddingX]="paddingX()"
            [paddingY]="paddingY()"
            [margin]="margin()"
            [rounded]="rounded()"
            [background]="background()"
            [border]="border()"
            [width]="width()"
            [height]="height()"
            [minWidth]="minWidth()"
            [maxWidth]="maxWidth()"
            [minHeight]="minHeight()"
            [maxHeight]="maxHeight()"
            [overflow]="overflow()"
            [overflowX]="overflowX()"
            [overflowY]="overflowY()"
            [shadow]="shadow()"
            [position]="position()"
            [top]="top()"
            [cursor]="cursor()"
            [userSelect]="userSelect()"
        >
            content
        </zyra-box>
    `,
})
class BoxHostComponent {
    display = signal<BoxDisplay>('block');
    padding = signal<BoxSpacing>('none');
    paddingX = signal<BoxSpacing | undefined>(undefined);
    paddingY = signal<BoxSpacing | undefined>(undefined);
    margin = signal<BoxSpacing>('none');
    rounded = signal<BoxRadius>('none');
    background = signal<BoxBackground>('none');
    border = signal(false);
    width = signal<string | number | undefined>(undefined);
    height = signal<string | number | undefined>(undefined);
    minWidth = signal<string | number | undefined>(undefined);
    maxWidth = signal<string | number | undefined>(undefined);
    minHeight = signal<string | number | undefined>(undefined);
    maxHeight = signal<string | number | undefined>(undefined);
    overflow = signal<BoxOverflow>('visible');
    overflowX = signal<BoxOverflow | undefined>(undefined);
    overflowY = signal<BoxOverflow | undefined>(undefined);
    shadow = signal<BoxShadow>('none');
    position = signal<BoxPosition>('static');
    top = signal<string | number | undefined>(undefined);
    cursor = signal<BoxCursor>('auto');
    userSelect = signal<BoxUserSelect>('auto');
}

@Component({
    standalone: true,
    imports: [ZyraBox],
    template: `<zyra-box />`,
})
class BoxHostEmptyComponent {}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('ZyraBox', () => {
    let fixture: ComponentFixture<BoxHostComponent>;
    let host: BoxHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BoxHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BoxHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.zyr-box');
    });

    // ── Render ────────────────────────────────────────────────────────────

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('zyra-box')).not.toBeNull();
    });

    it('applies the BEM root class "zyr-box"', () => {
        expect(el).not.toBeNull();
    });

    it('projects slotted content inside the host', () => {
        expect(el?.textContent?.trim()).toBe('content');
    });

    // ── Defaults ──────────────────────────────────────────────────────────

    it('defaults to block display with no padding/margin/radius/background', () => {
        expect(el.style.display).toBe('block');
        expect(el.style.paddingTop).toBe('0px');
        expect(el.style.marginTop).toBe('0px');
        expect(el.style.borderRadius).toBe('0px');
        expect(el.style.background).toBe('transparent');
    });

    it('defaults dimensions/overflow/shadow/position/cursor/user-select to no-ops', () => {
        expect(el.style.width).toBe('');
        expect(el.style.overflow).toBe('visible');
        expect(el.style.boxShadow).toBe('none');
        expect(el.style.position).toBe('static');
        expect(el.style.cursor).toBe('auto');
        expect(el.style.userSelect).toBe('auto');
    });

    // ── display ───────────────────────────────────────────────────────────

    it('reflects a custom display value', () => {
        host.display.set('flex');
        fixture.detectChanges();
        expect(el.style.display).toBe('flex');
    });

    // ── padding ───────────────────────────────────────────────────────────

    it('applies uniform padding from the spacing scale', () => {
        host.padding.set('md');
        fixture.detectChanges();
        expect(el.style.paddingTop).toBe('var(--zyra-space-4)');
        expect(el.style.paddingLeft).toBe('var(--zyra-space-4)');
    });

    it('lets paddingX/paddingY override the uniform padding per axis', () => {
        host.padding.set('md');
        host.paddingX.set('xl');
        fixture.detectChanges();
        expect(el.style.paddingLeft).toBe('var(--zyra-space-8)');
        expect(el.style.paddingTop).toBe('var(--zyra-space-4)');
    });

    // ── margin ────────────────────────────────────────────────────────────

    it('applies uniform margin from the spacing scale', () => {
        host.margin.set('lg');
        fixture.detectChanges();
        expect(el.style.marginTop).toBe('var(--zyra-space-6)');
    });

    // ── rounded ───────────────────────────────────────────────────────────

    it('applies a border radius from the radius scale', () => {
        host.rounded.set('full');
        fixture.detectChanges();
        expect(el.style.borderRadius).toBe('var(--zyra-radius-full)');
    });

    // ── background ────────────────────────────────────────────────────────

    it('applies a semantic background token', () => {
        host.background.set('surface');
        fixture.detectChanges();
        expect(el.style.background).toBe('var(--zyra-color-surface)');
    });

    it('applies a tone (theme variant) background token', () => {
        host.background.set('danger');
        fixture.detectChanges();
        expect(el.style.background).toBe('var(--zyra-color-danger-muted)');
    });

    // ── border ────────────────────────────────────────────────────────────

    it('does not apply the border class by default', () => {
        expect(el.classList.contains('zyr-box--border')).toBeFalse();
    });

    it('applies the border class when border is true', () => {
        host.border.set(true);
        fixture.detectChanges();
        expect(el.classList.contains('zyr-box--border')).toBeTrue();
    });

    it('tints the border color to match a tone background', () => {
        host.border.set(true);
        host.background.set('success');
        fixture.detectChanges();
        expect(el.style.borderColor).toBe('var(--zyra-color-success-border)');
    });

    // ── dimensions ────────────────────────────────────────────────────────

    it('converts a numeric width/height to pixels', () => {
        host.width.set(240);
        host.height.set(120);
        fixture.detectChanges();
        expect(el.style.width).toBe('240px');
        expect(el.style.height).toBe('120px');
    });

    it('passes a string width/height through untouched', () => {
        host.width.set('100%');
        fixture.detectChanges();
        expect(el.style.width).toBe('100%');
    });

    it('applies min/max width and height', () => {
        host.minWidth.set(100);
        host.maxWidth.set('600px');
        host.minHeight.set(50);
        host.maxHeight.set('80vh');
        fixture.detectChanges();
        expect(el.style.minWidth).toBe('100px');
        expect(el.style.maxWidth).toBe('600px');
        expect(el.style.minHeight).toBe('50px');
        expect(el.style.maxHeight).toBe('80vh');
    });

    // ── overflow ──────────────────────────────────────────────────────────

    it('applies a uniform overflow value', () => {
        host.overflow.set('hidden');
        fixture.detectChanges();
        expect(el.style.overflowX).toBe('hidden');
        expect(el.style.overflowY).toBe('hidden');
    });

    it('lets overflowX/overflowY override the uniform overflow per axis', () => {
        host.overflow.set('hidden');
        host.overflowY.set('auto');
        fixture.detectChanges();
        expect(el.style.overflowX).toBe('hidden');
        expect(el.style.overflowY).toBe('auto');
    });

    // ── shadow ────────────────────────────────────────────────────────────

    it('applies a shadow token', () => {
        host.shadow.set('md');
        fixture.detectChanges();
        expect(el.style.boxShadow).toBe('var(--zyra-shadow-md)');
    });

    // ── position ──────────────────────────────────────────────────────────

    it('applies a position value and offset', () => {
        host.position.set('sticky');
        host.top.set(0);
        fixture.detectChanges();
        expect(el.style.position).toBe('sticky');
        expect(el.style.top).toBe('0px');
    });

    // ── cursor / user-select ──────────────────────────────────────────────

    it('applies a cursor value', () => {
        host.cursor.set('pointer');
        fixture.detectChanges();
        expect(el.style.cursor).toBe('pointer');
    });

    it('applies a user-select value', () => {
        host.userSelect.set('none');
        fixture.detectChanges();
        expect(el.style.userSelect).toBe('none');
    });

    // ── Accessibility ─────────────────────────────────────────────────────

    it('root element is in the document', () => {
        expect(fixture.nativeElement.querySelector('zyra-box').isConnected).toBeTrue();
    });
});

describe('ZyraBox — empty slot', () => {
    it('renders without projected content without throwing', async () => {
        await TestBed.configureTestingModule({
            imports: [BoxHostEmptyComponent],
        }).compileComponents();

        const f = TestBed.createComponent(BoxHostEmptyComponent);
        expect(() => f.detectChanges()).not.toThrow();
    });
});

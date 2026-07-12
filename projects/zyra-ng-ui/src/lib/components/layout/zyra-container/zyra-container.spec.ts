import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraContainer, ContainerMaxWidth, ContainerResponsivePadding } from './zyra-container';
import { BoxBackground, BoxSpacing } from '../../../internal/box-style/box-style';

// ── Host fixtures ─────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [ZyraContainer],
    template: `
        <zyra-container
            [maxWidth]="maxWidth()"
            [centered]="centered()"
            [fluid]="fluid()"
            [noGutters]="noGutters()"
            [paddingX]="paddingX()"
            [background]="background()"
            [border]="border()"
        >
            content
        </zyra-container>
    `,
})
class ContainerHostComponent {
    maxWidth = signal<ContainerMaxWidth>('xl');
    centered = signal(true);
    fluid = signal(false);
    noGutters = signal(false);
    paddingX = signal<BoxSpacing | ContainerResponsivePadding>('md');
    background = signal<BoxBackground>('none');
    border = signal(false);
}

@Component({
    standalone: true,
    imports: [ZyraContainer],
    template: `<zyra-container />`,
})
class ContainerHostEmptyComponent {}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('ZyraContainer', () => {
    let fixture: ComponentFixture<ContainerHostComponent>;
    let host: ContainerHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContainerHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ContainerHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.zyr-container');
    });

    // ── Render ────────────────────────────────────────────────────────────

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('zyra-container')).not.toBeNull();
    });

    it('projects slotted content inside the host', () => {
        expect(el?.textContent?.trim()).toBe('content');
    });

    // ── Defaults ──────────────────────────────────────────────────────────

    it('defaults to xl max-width, centered, md horizontal padding', () => {
        expect(el.style.maxWidth).toBe('1280px');
        expect(el.style.marginLeft).toBe('auto');
        expect(el.style.marginRight).toBe('auto');
        expect(el.style.width).toBe('100%');
        expect(el.style.paddingLeft).toBe('var(--zyra-space-4)');
    });

    // ── maxWidth ──────────────────────────────────────────────────────────

    it('reflects a custom max-width preset', () => {
        host.maxWidth.set('sm');
        fixture.detectChanges();
        expect(el.style.maxWidth).toBe('640px');
    });

    it('maps "full" to 100%', () => {
        host.maxWidth.set('full');
        fixture.detectChanges();
        expect(el.style.maxWidth).toBe('100%');
    });

    // ── centered ──────────────────────────────────────────────────────────

    it('removes auto margins when centered is false', () => {
        host.centered.set(false);
        fixture.detectChanges();
        expect(el.style.marginLeft).toBe('0px');
        expect(el.style.marginRight).toBe('0px');
    });

    // ── paddingX ──────────────────────────────────────────────────────────

    it('applies a custom horizontal padding', () => {
        host.paddingX.set('xl');
        fixture.detectChanges();
        expect(el.style.paddingLeft).toBe('var(--zyra-space-8)');
        expect(el.style.paddingRight).toBe('var(--zyra-space-8)');
    });

    // ── fluid ────────────────────────────────────────────────────────────────

    it('removes the max-width constraint when fluid is true', () => {
        host.fluid.set(true);
        fixture.detectChanges();
        expect(el.style.maxWidth).toBe('none');
    });

    it('lets fluid override even the "responsive" maxWidth mode', () => {
        host.maxWidth.set('responsive');
        host.fluid.set(true);
        fixture.detectChanges();
        expect(el.style.maxWidth).toBe('none');
        expect(el.classList.contains('zyr-container--responsive-mw')).toBeFalse();
    });

    // ── responsive maxWidth ────────────────────────────────────────────────

    it('hands off max-width to the stylesheet in "responsive" mode', () => {
        host.maxWidth.set('responsive');
        fixture.detectChanges();
        // The inline style must NOT set max-width directly — an inline value
        // would permanently beat every @media rule regardless of viewport.
        expect(el.style.maxWidth).toBe('');
        expect(el.classList.contains('zyr-container--responsive-mw')).toBeTrue();
        expect(el.style.getPropertyValue('--zyr-container-mw-base')).toBe('100%');
        expect(el.style.getPropertyValue('--zyr-container-mw-lg')).toBe('960px');
        // Whichever breakpoint the test browser's window width matches, the
        // stylesheet must be the one resolving it — never the browser default.
        expect(getComputedStyle(el).maxWidth).not.toBe('none');
    });

    // ── noGutters ────────────────────────────────────────────────────────────

    it('removes horizontal padding when noGutters is true, regardless of paddingX', () => {
        host.paddingX.set('xl');
        host.noGutters.set(true);
        fixture.detectChanges();
        expect(el.style.paddingLeft).toBe('0px');
        expect(el.style.paddingRight).toBe('0px');
    });

    // ── responsive paddingX ──────────────────────────────────────────────────

    it('hands off horizontal padding to the stylesheet for a responsive paddingX object', () => {
        host.paddingX.set({ base: 'sm', lg: 'xl' });
        fixture.detectChanges();
        expect(el.style.paddingLeft).toBe('');
        expect(el.classList.contains('zyr-container--responsive-px')).toBeTrue();
        expect(el.style.getPropertyValue('--zyr-container-px-base')).toBe('var(--zyra-space-2)');
        expect(el.style.getPropertyValue('--zyr-container-px-lg')).toBe('var(--zyra-space-8)');
    });

    // ── background ────────────────────────────────────────────────────────

    it('applies a semantic background token', () => {
        host.background.set('surface');
        fixture.detectChanges();
        expect(el.style.background).toBe('var(--zyra-color-surface)');
    });

    // ── border ────────────────────────────────────────────────────────────

    it('applies the border class when border is true', () => {
        host.border.set(true);
        fixture.detectChanges();
        expect(el.classList.contains('zyr-container--border')).toBeTrue();
    });

    // ── Accessibility ─────────────────────────────────────────────────────

    it('root element is in the document', () => {
        expect(fixture.nativeElement.querySelector('zyra-container').isConnected).toBeTrue();
    });
});

describe('ZyraContainer — empty slot', () => {
    it('renders without projected content without throwing', async () => {
        await TestBed.configureTestingModule({
            imports: [ContainerHostEmptyComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ContainerHostEmptyComponent);
        expect(() => f.detectChanges()).not.toThrow();
    });
});

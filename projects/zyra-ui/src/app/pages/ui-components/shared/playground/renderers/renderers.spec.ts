/**
 * Renderer smoke tests.
 *
 * Each renderer is a thin component that accepts signal inputs and renders the
 * corresponding Zyra UI library component. Tests verify:
 *   1. The renderer mounts without errors (default inputs)
 *   2. The library component is present in the DOM
 *   3. Key inputs are reflected to the rendered output
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';

import { ButtonRenderer } from './button-renderer';
import { BadgeRenderer } from './badge-renderer';
import { SpinnerRenderer } from './spinner-renderer';
import { ToggleRenderer } from './toggle-renderer';

// ── Generic renderer helper ───────────────────────────────────────────────────

async function mountRenderer<T>(
    cls: Type<T>,
): Promise<{ fixture: ComponentFixture<T>; component: T; el: HTMLElement }> {
    await TestBed.configureTestingModule({ imports: [cls as Type<unknown>] }).compileComponents();
    const fixture = TestBed.createComponent(cls);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance, el: fixture.nativeElement };
}

// ── ButtonRenderer ────────────────────────────────────────────────────────────

describe('ButtonRenderer', () => {
    let fixture: ComponentFixture<ButtonRenderer>;
    let component: ButtonRenderer;
    let el: HTMLElement;

    beforeEach(async () => {
        ({ fixture, component, el } = await mountRenderer(ButtonRenderer));
    });

    afterEach(() => TestBed.resetTestingModule());

    it('renders a zyra-button element', () => {
        expect(el.querySelector('zyra-button')).not.toBeNull();
    });

    it('default variant is "primary"', () => {
        expect(component.variant()).toBe('primary');
    });

    it('default size is "md"', () => {
        expect(component.size()).toBe('md');
    });

    it('default label is "Button"', () => {
        expect(component.label()).toBe('Button');
    });

    it('default loading is false', () => {
        expect(component.loading()).toBeFalse();
    });

    it('default disabled is false', () => {
        expect(component.disabled()).toBeFalse();
    });

    it('default fullWidth is false', () => {
        expect(component.fullWidth()).toBeFalse();
    });

    it('button text reflects the label input', () => {
        fixture.componentRef.setInput('label', 'Save');
        fixture.detectChanges();
        const btn: HTMLElement = el.querySelector('zyra-button')!;
        expect(btn.textContent?.trim()).toBe('Save');
    });
});

// ── BadgeRenderer ─────────────────────────────────────────────────────────────

describe('BadgeRenderer', () => {
    let fixture: ComponentFixture<BadgeRenderer>;
    let component: BadgeRenderer;
    let el: HTMLElement;

    beforeEach(async () => {
        ({ fixture, component, el } = await mountRenderer(BadgeRenderer));
    });

    afterEach(() => TestBed.resetTestingModule());

    it('renders a zyra-badge element', () => {
        expect(el.querySelector('zyra-badge')).not.toBeNull();
    });

    it('default variant is "success"', () => {
        expect(component.variant()).toBe('success');
    });

    it('default size is "md"', () => {
        expect(component.size()).toBe('md');
    });

    it('default dot is false', () => {
        expect(component.dot()).toBeFalse();
    });

    it('default label is "Badge"', () => {
        expect(component.label()).toBe('Badge');
    });

    it('badge text reflects the label input', () => {
        fixture.componentRef.setInput('label', 'New');
        fixture.detectChanges();
        const badge: HTMLElement = el.querySelector('zyra-badge')!;
        expect(badge.textContent?.trim()).toBe('New');
    });
});

// ── SpinnerRenderer ───────────────────────────────────────────────────────────

describe('SpinnerRenderer', () => {
    let component: SpinnerRenderer;
    let el: HTMLElement;

    beforeEach(async () => {
        ({ component, el } = await mountRenderer(SpinnerRenderer));
    });

    afterEach(() => TestBed.resetTestingModule());

    it('renders a zyra-spinner element', () => {
        expect(el.querySelector('zyra-spinner')).not.toBeNull();
    });

    it('default size is "md"', () => {
        expect(component.size()).toBe('md');
    });

    it('default color is "accent"', () => {
        expect(component.color()).toBe('accent');
    });

    it('default label is "Loading…"', () => {
        expect(component.label()).toBe('Loading…');
    });
});

// ── ToggleRenderer ────────────────────────────────────────────────────────────

describe('ToggleRenderer', () => {
    let component: ToggleRenderer;
    let el: HTMLElement;

    beforeEach(async () => {
        ({ component, el } = await mountRenderer(ToggleRenderer));
    });

    afterEach(() => TestBed.resetTestingModule());

    it('renders a zyra-toggle element', () => {
        expect(el.querySelector('zyra-toggle')).not.toBeNull();
    });

    it('default size is "md"', () => {
        expect(component.size()).toBe('md');
    });

    it('default label is "Enable notifications"', () => {
        expect(component.label()).toBe('Enable notifications');
    });

    it('default labelPosition is "right"', () => {
        expect(component.labelPosition()).toBe('right');
    });

    it('default disabled is false', () => {
        expect(component.disabled()).toBeFalse();
    });
});

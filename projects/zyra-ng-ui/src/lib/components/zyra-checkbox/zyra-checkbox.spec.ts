import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraCheckbox } from './zyra-checkbox';

@Component({
    standalone: true,
    imports: [ZyraCheckbox],
    template: `
        <zyra-checkbox
            [(checked)]="checked"
            [label]="label()"
            [disabled]="disabled()"
            [indeterminate]="indeterminate()"
            [size]="size()"
        />
    `,
})
class CheckboxHostComponent {
    checked       = false;
    label         = signal('Accept terms');
    disabled      = signal(false);
    indeterminate = signal(false);
    size          = signal<'sm' | 'md' | 'lg'>('md');
}

@Component({
    standalone: true,
    imports: [ZyraCheckbox],
    template: `<zyra-checkbox size="lg" label="Large" />`,
})
class CheckboxLgHostComponent {}

@Component({
    standalone: true,
    imports: [ZyraCheckbox],
    template: `<zyra-checkbox size="sm" label="Small" />`,
})
class CheckboxSmHostComponent {}

describe('ZyraCheckbox', () => {
    let fixture: ComponentFixture<CheckboxHostComponent>;
    let host: CheckboxHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [CheckboxHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(CheckboxHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Label ─────────────────────────────────────────────────────────────
    it('renders the label text', () => {
        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-checkbox__label');
        expect(label.textContent?.trim()).toBe('Accept terms');
    });

    // ── Toggle ────────────────────────────────────────────────────────────
    it('toggles checked state on box click', () => {
        box(fixture).click();
        fixture.detectChanges();
        expect(host.checked).toBeTrue();
        expect(fixture.nativeElement.querySelector('.zyr-checkbox--checked')).not.toBeNull();
    });

    it('toggles back to unchecked on second click', () => {
        box(fixture).click();
        fixture.detectChanges();
        box(fixture).click();
        fixture.detectChanges();
        expect(host.checked).toBeFalse();
        expect(fixture.nativeElement.querySelector('.zyr-checkbox--checked')).toBeNull();
    });

    it('does not toggle when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        box(fixture).click();
        fixture.detectChanges();
        expect(host.checked).toBeFalse();
    });

    // ── Keyboard ──────────────────────────────────────────────────────────
    it('toggles on Space key press', () => {
        box(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        fixture.detectChanges();
        expect(host.checked).toBeTrue();
    });

    // ── Disabled ──────────────────────────────────────────────────────────
    it('applies --disabled class when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-checkbox--disabled')).not.toBeNull();
    });

    // ── Indeterminate ─────────────────────────────────────────────────────
    it('sets aria-checked to "mixed" when indeterminate', () => {
        host.indeterminate.set(true);
        fixture.detectChanges();
        expect(box(fixture).getAttribute('aria-checked')).toBe('mixed');
    });

    it('applies --indeterminate class when indeterminate', () => {
        host.indeterminate.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-checkbox--indeterminate')).not.toBeNull();
    });

    it('does not toggle indeterminate state on click (clears it)', () => {
        host.indeterminate.set(true);
        fixture.detectChanges();
        box(fixture).click();
        fixture.detectChanges();
        expect(host.checked).toBeTrue();
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('sets aria-checked to "true" when checked', () => {
        box(fixture).click();
        fixture.detectChanges();
        expect(box(fixture).getAttribute('aria-checked')).toBe('true');
    });

    it('sets aria-checked to "false" when unchecked', () => {
        expect(box(fixture).getAttribute('aria-checked')).toBe('false');
    });

    it('has role="checkbox" on the box button', () => {
        expect(box(fixture).getAttribute('role')).toBe('checkbox');
    });

    // ── CVA ───────────────────────────────────────────────────────────────
    it('supports CVA writeValue(true)', () => {
        const instance: ZyraCheckbox = fixture.debugElement.children[0].componentInstance;
        instance.writeValue(true);
        fixture.detectChanges();
        expect(instance.checked()).toBeTrue();
    });

    it('supports CVA writeValue(false)', () => {
        const instance: ZyraCheckbox = fixture.debugElement.children[0].componentInstance;
        instance.writeValue(true);
        instance.writeValue(false);
        fixture.detectChanges();
        expect(instance.checked()).toBeFalse();
    });

    it('supports CVA setDisabledState', () => {
        const instance: ZyraCheckbox = fixture.debugElement.children[0].componentInstance;
        instance.setDisabledState(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-checkbox--disabled')).not.toBeNull();
    });

    // ── Size ──────────────────────────────────────────────────────────────
    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-checkbox--md')).not.toBeNull();
    });

    it('applies lg size class', async () => {
        await TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [CheckboxLgHostComponent] }).compileComponents();
        const lgFixture = TestBed.createComponent(CheckboxLgHostComponent);
        lgFixture.detectChanges();
        expect(lgFixture.nativeElement.querySelector('.zyr-checkbox--lg')).not.toBeNull();
    });

    it('applies sm size class', async () => {
        await TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [CheckboxSmHostComponent] }).compileComponents();
        const smFixture = TestBed.createComponent(CheckboxSmHostComponent);
        smFixture.detectChanges();
        expect(smFixture.nativeElement.querySelector('.zyr-checkbox--sm')).not.toBeNull();
    });
});

function box(f: ComponentFixture<CheckboxHostComponent>): HTMLButtonElement {
    return f.nativeElement.querySelector('.zyr-checkbox__box');
}

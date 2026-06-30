import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraButton } from './zyra-button';

@Component({
    standalone: true,
    imports: [ZyraButton],
    template: `
        <zyra-button
            [variant]="variant()"
            [size]="size()"
            [loading]="loading()"
            [disabled]="disabled()"
            [fullWidth]="fullWidth()"
            [type]="btnType()"
            (clicked)="clicks = clicks + 1"
            >Save</zyra-button
        >
    `,
})
class ButtonHostComponent {
    variant = signal<'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'>('primary');
    size = signal<'sm' | 'md' | 'lg'>('md');
    loading = signal(false);
    disabled = signal(false);
    fullWidth = signal(false);
    btnType = signal<'button' | 'submit' | 'reset'>('button');
    clicks = 0;
}

describe('ZyraButton', () => {
    let fixture: ComponentFixture<ButtonHostComponent>;
    let host: ButtonHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(ButtonHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Content & label ───────────────────────────────────────────────────
    it('renders projected content', () => {
        expect(fixture.nativeElement.querySelector('button').textContent).toContain('Save');
    });

    // ── Variant classes ───────────────────────────────────────────────────
    it('applies primary variant class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-btn--primary')).not.toBeNull();
    });

    it('applies secondary variant class', () => {
        host.variant.set('secondary');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn--secondary')).not.toBeNull();
    });

    it('applies ghost variant class', () => {
        host.variant.set('ghost');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn--ghost')).not.toBeNull();
    });

    it('applies danger variant class', () => {
        host.variant.set('danger');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn--danger')).not.toBeNull();
    });

    it('applies outline variant class', () => {
        host.variant.set('outline');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn--outline')).not.toBeNull();
    });

    // ── Size classes ──────────────────────────────────────────────────────
    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-btn--md')).not.toBeNull();
    });

    it('applies sm size class', () => {
        host.size.set('sm');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn--sm')).not.toBeNull();
    });

    it('applies lg size class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn--lg')).not.toBeNull();
    });

    // ── Full width ────────────────────────────────────────────────────────
    it('applies full-width class when fullWidth is true', () => {
        host.fullWidth.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn--full')).not.toBeNull();
    });

    it('does not apply full-width class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-btn--full')).toBeNull();
    });

    // ── Click handling ────────────────────────────────────────────────────
    it('emits clicked on press', () => {
        fixture.nativeElement.querySelector('button').click();
        expect(host.clicks).toBe(1);
    });

    it('does not emit when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        fixture.nativeElement.querySelector('button').click();
        expect(host.clicks).toBe(0);
    });

    it('does not emit when loading', () => {
        host.loading.set(true);
        fixture.detectChanges();
        fixture.nativeElement.querySelector('button').click();
        expect(host.clicks).toBe(0);
    });

    // ── Disabled state ────────────────────────────────────────────────────
    it('applies --disabled class and disables native button when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(btn.disabled).toBeTrue();
        expect(btn.className).toContain('zyr-btn--disabled');
        expect(btn.getAttribute('aria-disabled')).toBe('true');
    });

    // ── Loading state ─────────────────────────────────────────────────────
    it('applies --loading class, disables button, sets aria-busy when loading', () => {
        host.loading.set(true);
        fixture.detectChanges();
        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(btn.disabled).toBeTrue();
        expect(btn.className).toContain('zyr-btn--loading');
        expect(btn.getAttribute('aria-busy')).toBe('true');
    });

    it('shows spinner while loading', () => {
        host.loading.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('zyra-spinner')).not.toBeNull();
    });

    it('hides spinner when not loading', () => {
        expect(fixture.nativeElement.querySelector('zyra-spinner')).toBeNull();
    });

    // ── Type attribute ────────────────────────────────────────────────────
    it('sets type="button" by default', () => {
        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(btn.type).toBe('button');
    });

    it('sets type="submit" when specified', () => {
        host.btnType.set('submit');
        fixture.detectChanges();
        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(btn.type).toBe('submit');
    });
});

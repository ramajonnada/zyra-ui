import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraBadge } from './zyra-badge';

@Component({
    standalone: true,
    imports: [ZyraBadge],
    template: `
        <zyra-badge [variant]="variant()" [size]="size()" [dot]="dot()" [ariaLabel]="ariaLabel()">{{
            label()
        }}</zyra-badge>
    `,
})
class BadgeHostComponent {
    variant = signal<'success' | 'warning' | 'danger' | 'info' | 'purple' | 'default'>('default');
    size = signal<'sm' | 'md' | 'lg'>('md');
    dot = signal(false);
    ariaLabel = signal('');
    label = signal('Stable');
}

describe('ZyraBadge', () => {
    let fixture: ComponentFixture<BadgeHostComponent>;
    let host: BadgeHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [BadgeHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(BadgeHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Content ───────────────────────────────────────────────────────────
    it('renders projected content', () => {
        expect(fixture.nativeElement.querySelector('.zyr-badge').textContent).toContain('Stable');
    });

    // ── Variant ───────────────────────────────────────────────────────────
    it('applies the default variant class', () => {
        expect(fixture.nativeElement.querySelector('.zyr-badge--default')).not.toBeNull();
    });

    it('applies success variant class', () => {
        host.variant.set('success');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-badge--success')).not.toBeNull();
    });

    it('applies warning variant class', () => {
        host.variant.set('warning');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-badge--warning')).not.toBeNull();
    });

    it('applies danger variant class', () => {
        host.variant.set('danger');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-badge--danger')).not.toBeNull();
    });

    it('applies info variant class', () => {
        host.variant.set('info');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-badge--info')).not.toBeNull();
    });

    it('applies purple variant class', () => {
        host.variant.set('purple');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-badge--purple')).not.toBeNull();
    });

    // ── Size ──────────────────────────────────────────────────────────────
    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-badge--md')).not.toBeNull();
    });

    it('applies sm size class', () => {
        host.size.set('sm');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-badge--sm')).not.toBeNull();
    });

    it('applies lg size class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-badge--lg')).not.toBeNull();
    });

    // ── Dot ───────────────────────────────────────────────────────────────
    it('does not render dot element by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-badge__dot')).toBeNull();
    });

    it('renders dot element when dot is true', () => {
        host.dot.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-badge__dot')).not.toBeNull();
    });

    it('dot element is aria-hidden', () => {
        host.dot.set(true);
        fixture.detectChanges();
        const dot: HTMLElement = fixture.nativeElement.querySelector('.zyr-badge__dot');
        expect(dot.getAttribute('aria-hidden')).toBe('true');
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('sets aria-label when provided', () => {
        host.ariaLabel.set('Build status');
        fixture.detectChanges();
        const badge: HTMLElement = fixture.nativeElement.querySelector('.zyr-badge');
        expect(badge.getAttribute('aria-label')).toBe('Build status');
    });

    it('does not set aria-label when empty', () => {
        const badge: HTMLElement = fixture.nativeElement.querySelector('.zyr-badge');
        expect(badge.getAttribute('aria-label')).toBeFalsy();
    });
});

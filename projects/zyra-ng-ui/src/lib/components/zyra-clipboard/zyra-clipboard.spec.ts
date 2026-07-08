import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraClipboard } from './zyra-clipboard';

@Component({
    standalone: true,
    imports: [ZyraClipboard],
    template: `
        <zyra-clipboard
            [value]="value()"
            [label]="label()"
            [copiedLabel]="copiedLabel()"
            [size]="size()"
            [variant]="variant()"
            (copied)="copiedCount = copiedCount + 1"
        />
    `,
})
class ClipboardHostComponent {
    value = signal('npm install zyra-ng-ui');
    label = signal('Copy');
    copiedLabel = signal('Copied!');
    size = signal<'sm' | 'md' | 'lg'>('md');
    variant = signal<'button' | 'icon'>('button');
    copiedCount = 0;
}

describe('ZyraClipboard', () => {
    let fixture: ComponentFixture<ClipboardHostComponent>;
    let host: ClipboardHostComponent;
    let writeTextSpy: jasmine.Spy;

    beforeEach(async () => {
        writeTextSpy = jasmine.createSpy('writeText').and.returnValue(Promise.resolve());
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: writeTextSpy },
            configurable: true,
        });

        await TestBed.configureTestingModule({ imports: [ClipboardHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(ClipboardHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Content ───────────────────────────────────────────────────────────
    it('renders the label text', () => {
        expect(fixture.nativeElement.querySelector('.zyr-clipboard__label').textContent).toContain('Copy');
    });

    // ── Size ──────────────────────────────────────────────────────────────
    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-clipboard--md')).not.toBeNull();
    });

    it('applies sm size class', () => {
        host.size.set('sm');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-clipboard--sm')).not.toBeNull();
    });

    it('applies lg size class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-clipboard--lg')).not.toBeNull();
    });

    // ── Variant ───────────────────────────────────────────────────────────
    it('applies button variant class by default and renders label', () => {
        expect(fixture.nativeElement.querySelector('.zyr-clipboard--button')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-clipboard__label')).not.toBeNull();
    });

    it('applies icon variant class and hides label', () => {
        host.variant.set('icon');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-clipboard--icon')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-clipboard__label')).toBeNull();
    });

    // ── Copy behavior ─────────────────────────────────────────────────────
    it('copies the value to the clipboard on click', () => {
        fixture.nativeElement.querySelector('button').click();
        expect(writeTextSpy).toHaveBeenCalledWith('npm install zyra-ng-ui');
    });

    it('emits copied after a successful copy', async () => {
        fixture.nativeElement.querySelector('button').click();
        await Promise.resolve();
        await Promise.resolve();
        expect(host.copiedCount).toBe(1);
    });

    it('shows the copied label after copying, then reverts after 2000ms', async () => {
        jasmine.clock().install();
        try {
            fixture.nativeElement.querySelector('button').click();
            await Promise.resolve();
            await Promise.resolve();
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('.zyr-clipboard--copied')).not.toBeNull();
            expect(fixture.nativeElement.querySelector('.zyr-clipboard__label').textContent).toContain('Copied!');

            jasmine.clock().tick(2000);
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('.zyr-clipboard--copied')).toBeNull();
            expect(fixture.nativeElement.querySelector('.zyr-clipboard__label').textContent).toContain('Copy');
        } finally {
            jasmine.clock().uninstall();
        }
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('sets aria-label in icon variant', () => {
        host.variant.set('icon');
        fixture.detectChanges();
        const btn: HTMLElement = fixture.nativeElement.querySelector('button');
        expect(btn.getAttribute('aria-label')).toBe('Copy');
    });

    it('does not set aria-label in button variant', () => {
        const btn: HTMLElement = fixture.nativeElement.querySelector('button');
        expect(btn.getAttribute('aria-label')).toBeFalsy();
    });
});

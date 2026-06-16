import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraProgress } from './zyra-progress';

@Component({
    standalone: true,
    imports: [ZyraProgress],
    template: `
        <zyra-progress
            [value]="value()"
            [max]="max()"
            [variant]="variant()"
            [size]="size()"
            [indeterminate]="indeterminate()"
            [showLabel]="showLabel()"
            [label]="label()"
        />
    `,
})
class ProgressHostComponent {
    value = signal(50);
    max = signal(100);
    variant = signal<'default' | 'success' | 'warning' | 'danger' | 'info'>('default');
    size = signal<'sm' | 'md' | 'lg'>('md');
    indeterminate = signal(false);
    showLabel = signal(false);
    label = signal('');
}

describe('ZyraProgress', () => {
    let fixture: ComponentFixture<ProgressHostComponent>;
    let host: ProgressHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProgressHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProgressHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('renders the progress track', () => {
        expect(fixture.nativeElement.querySelector('.zyr-progress__track')).not.toBeNull();
    });

    it('sets bar width to the correct percentage', () => {
        host.value.set(75);
        fixture.detectChanges();

        const bar: HTMLElement = fixture.nativeElement.querySelector('.zyr-progress__bar');
        expect(bar.style.width).toBe('75%');
    });

    it('clamps value below 0 to 0%', () => {
        host.value.set(-10);
        fixture.detectChanges();

        const bar: HTMLElement = fixture.nativeElement.querySelector('.zyr-progress__bar');
        expect(bar.style.width).toBe('0%');
    });

    it('clamps value above max to 100%', () => {
        host.value.set(200);
        fixture.detectChanges();

        const bar: HTMLElement = fixture.nativeElement.querySelector('.zyr-progress__bar');
        expect(bar.style.width).toBe('100%');
    });

    it('sets correct aria attributes', () => {
        host.value.set(40);
        host.max.set(200);
        fixture.detectChanges();

        const track: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"]');
        expect(track.getAttribute('aria-valuenow')).toBe('40');
        expect(track.getAttribute('aria-valuemin')).toBe('0');
        expect(track.getAttribute('aria-valuemax')).toBe('200');
    });

    it('applies the variant class', () => {
        host.variant.set('success');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-progress--success')).not.toBeNull();
    });

    it('applies the size class', () => {
        host.size.set('lg');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-progress--lg')).not.toBeNull();
    });

    it('shows label when showLabel is true', () => {
        host.showLabel.set(true);
        host.value.set(60);
        fixture.detectChanges();

        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-progress__label');
        expect(label).not.toBeNull();
        expect(label.textContent?.trim()).toBe('60%');
    });

    it('shows custom label text when provided', () => {
        host.showLabel.set(true);
        host.label.set('Loading...');
        fixture.detectChanges();

        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-progress__label');
        expect(label.textContent?.trim()).toBe('Loading...');
    });

    it('does not render label element when showLabel is false', () => {
        expect(fixture.nativeElement.querySelector('.zyr-progress__header')).toBeNull();
    });

    it('applies --indeterminate class in indeterminate mode', () => {
        host.indeterminate.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-progress--indeterminate')).not.toBeNull();
    });

    it('removes aria attributes in indeterminate mode', () => {
        host.indeterminate.set(true);
        fixture.detectChanges();

        const track: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"]');
        expect(track.getAttribute('aria-valuenow')).toBeNull();
        expect(track.getAttribute('aria-valuemin')).toBeNull();
        expect(track.getAttribute('aria-valuemax')).toBeNull();
    });

    it('removes bar width style in indeterminate mode', () => {
        host.indeterminate.set(true);
        fixture.detectChanges();

        const bar: HTMLElement = fixture.nativeElement.querySelector('.zyr-progress__bar');
        expect(bar.style.width).toBeFalsy();
    });
});

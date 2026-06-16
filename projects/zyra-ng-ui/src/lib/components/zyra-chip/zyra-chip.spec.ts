import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraChip } from './zyra-chip';

@Component({
    standalone: true,
    imports: [ZyraChip],
    template: `
        <zyra-chip
            [variant]="variant()"
            [size]="size()"
            [dismissible]="dismissible()"
            [selectable]="selectable()"
            [(selected)]="selected"
            [disabled]="disabled()"
            (dismissed)="onDismissed()"
        >Angular</zyra-chip>
    `,
})
class ChipHostComponent {
    variant = signal<'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'>('default');
    size = signal<'sm' | 'md' | 'lg'>('md');
    dismissible = signal(false);
    selectable = signal(false);
    selected = false;
    disabled = signal(false);
    dismissed = false;

    onDismissed(): void {
        this.dismissed = true;
    }
}

describe('ZyraChip', () => {
    let fixture: ComponentFixture<ChipHostComponent>;
    let host: ChipHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChipHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChipHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('renders projected content', () => {
        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-chip__label');
        expect(label.textContent?.trim()).toBe('Angular');
    });

    it('applies the variant class', () => {
        host.variant.set('success');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-chip--success')).not.toBeNull();
    });

    it('applies the size class', () => {
        host.size.set('sm');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-chip--sm')).not.toBeNull();
    });

    it('shows dismiss button when dismissible is true', () => {
        host.dismissible.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-chip__dismiss')).not.toBeNull();
    });

    it('hides dismiss button when dismissible is false', () => {
        expect(fixture.nativeElement.querySelector('.zyr-chip__dismiss')).toBeNull();
    });

    it('emits dismissed when dismiss button is clicked', () => {
        host.dismissible.set(true);
        fixture.detectChanges();

        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-chip__dismiss');
        btn.click();
        fixture.detectChanges();

        expect(host.dismissed).toBeTrue();
    });

    it('applies --selectable class when selectable', () => {
        host.selectable.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-chip--selectable')).not.toBeNull();
    });

    it('toggles selected state on click when selectable', () => {
        host.selectable.set(true);
        fixture.detectChanges();

        const chip: HTMLElement = fixture.nativeElement.querySelector('.zyr-chip');
        chip.click();
        fixture.detectChanges();

        expect(host.selected).toBeTrue();
        expect(fixture.nativeElement.querySelector('.zyr-chip--selected')).not.toBeNull();
    });

    it('does not toggle when disabled', () => {
        host.selectable.set(true);
        host.disabled.set(true);
        fixture.detectChanges();

        const chip: HTMLElement = fixture.nativeElement.querySelector('.zyr-chip');
        chip.click();
        fixture.detectChanges();

        expect(host.selected).toBeFalse();
    });

    it('applies --disabled class when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-chip--disabled')).not.toBeNull();
    });

    it('sets role="checkbox" and aria-checked when selectable', () => {
        host.selectable.set(true);
        fixture.detectChanges();

        const chip: HTMLElement = fixture.nativeElement.querySelector('.zyr-chip');
        expect(chip.getAttribute('role')).toBe('checkbox');
        expect(chip.getAttribute('aria-checked')).toBe('false');
    });
});

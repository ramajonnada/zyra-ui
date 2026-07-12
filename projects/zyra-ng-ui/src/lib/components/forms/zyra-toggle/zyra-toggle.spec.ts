import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraToggle } from './zyra-toggle';

@Component({
    standalone: true,
    imports: [ZyraToggle],
    template: `
        <zyra-toggle
            [(pressed)]="pressed"
            [size]="size()"
            [disabled]="disabled()"
            aria-label="Bold"
        >
            B
        </zyra-toggle>
    `,
})
class ToggleHostComponent {
    pressed = false;
    size = signal<'sm' | 'md' | 'lg'>('md');
    disabled = signal(false);
}

describe('ZyraToggle', () => {
    let fixture: ComponentFixture<ToggleHostComponent>;
    let host: ToggleHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToggleHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ToggleHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('renders projected content', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-toggle');
        expect(button.textContent?.trim()).toBe('B');
    });

    it('toggles pressed state on click', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-toggle');
        button.click();
        fixture.detectChanges();

        expect(host.pressed).toBeTrue();
    });

    it('reflects aria-pressed on the button', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-toggle');
        expect(button.getAttribute('aria-pressed')).toBe('false');

        button.click();
        fixture.detectChanges();

        expect(button.getAttribute('aria-pressed')).toBe('true');
    });

    it('does not toggle when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();

        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-toggle');
        button.click();
        fixture.detectChanges();

        expect(host.pressed).toBeFalse();
    });

    it('applies --disabled class when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-toggle--disabled')).not.toBeNull();
    });

    it('applies --pressed class when pressed', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-toggle');
        button.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-toggle--pressed')).not.toBeNull();
    });

    it('applies the size class', () => {
        host.size.set('lg');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-toggle--lg')).not.toBeNull();
    });

    it('applies the aria-label', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-toggle');
        expect(button.getAttribute('aria-label')).toBe('Bold');
    });

    it('supports CVA writeValue', () => {
        const instance: ZyraToggle = fixture.debugElement.children[0].componentInstance;
        instance.writeValue(true);
        fixture.detectChanges();

        expect(instance.pressed()).toBeTrue();
    });

    it('supports CVA setDisabledState', () => {
        const instance: ZyraToggle = fixture.debugElement.children[0].componentInstance;
        instance.setDisabledState(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-toggle--disabled')).not.toBeNull();
    });
});

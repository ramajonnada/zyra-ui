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
            (clicked)="clicks = clicks + 1"
        >
            Save changes
        </zyra-button>
    `,
})
class ButtonHostComponent {
    variant = signal<'secondary'>('secondary');
    size = signal<'lg'>('lg');
    loading = signal(false);
    disabled = signal(false);
    fullWidth = signal(true);
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

    it('renders projected content and state classes', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

        expect(button.textContent).toContain('Save changes');
        expect(button.className).toContain('zyr-btn--secondary');
        expect(button.className).toContain('zyr-btn--lg');
        expect(button.className).toContain('zyr-btn--full');
    });

    it('emits clicked when pressed', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

        button.click();

        expect(host.clicks).toBe(1);
    });

    it('suppresses clicks and shows a spinner while loading', () => {
        host.loading.set(true);
        fixture.detectChanges();

        const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        button.click();

        expect(host.clicks).toBe(0);
        expect(button.disabled).toBeTrue();
        expect(button.getAttribute('aria-busy')).toBe('true');
        expect(fixture.nativeElement.querySelector('zyra-spinner')).not.toBeNull();
    });
});

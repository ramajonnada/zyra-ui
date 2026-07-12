import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraSwitch } from './zyra-switch';

@Component({
    standalone: true,
    imports: [ZyraSwitch],
    template: `
        <zyra-switch
            [(checked)]="checked"
            [label]="label()"
            [size]="size()"
            [disabled]="disabled()"
            [labelPosition]="labelPosition()"
        />
    `,
})
class SwitchHostComponent {
    checked = false;
    label = signal('Enable notifications');
    size = signal<'sm' | 'md' | 'lg'>('md');
    disabled = signal(false);
    labelPosition = signal<'left' | 'right'>('right');
}

describe('ZyraSwitch', () => {
    let fixture: ComponentFixture<SwitchHostComponent>;
    let host: SwitchHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SwitchHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SwitchHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('renders the label text', () => {
        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-switch__label');
        expect(label.textContent?.trim()).toBe('Enable notifications');
    });

    it('toggles checked state on track click', () => {
        const track: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-switch__track');
        track.click();
        fixture.detectChanges();

        expect(host.checked).toBeTrue();
    });

    it('reflects aria-checked on the track', () => {
        const track: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-switch__track');
        expect(track.getAttribute('aria-checked')).toBe('false');

        track.click();
        fixture.detectChanges();

        expect(track.getAttribute('aria-checked')).toBe('true');
    });

    it('does not toggle when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();

        const track: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-switch__track');
        track.click();
        fixture.detectChanges();

        expect(host.checked).toBeFalse();
    });

    it('applies --disabled class when disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-switch--disabled')).not.toBeNull();
    });

    it('applies the size class', () => {
        host.size.set('lg');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-switch--lg')).not.toBeNull();
    });

    it('renders label on the right by default', () => {
        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-switch__label');
        const track: HTMLElement = fixture.nativeElement.querySelector('.zyr-switch__track');
        expect(
            label.compareDocumentPosition(track) & Node.DOCUMENT_POSITION_PRECEDING,
        ).toBeTruthy();
    });

    it('renders label on the left when labelPosition is left', () => {
        host.labelPosition.set('left');
        fixture.detectChanges();

        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-switch__label');
        const track: HTMLElement = fixture.nativeElement.querySelector('.zyr-switch__track');
        expect(
            label.compareDocumentPosition(track) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
    });

    it('supports CVA writeValue', () => {
        const instance: ZyraSwitch = fixture.debugElement.children[0].componentInstance;
        instance.writeValue(true);
        fixture.detectChanges();

        expect(instance.checked()).toBeTrue();
    });

    it('supports CVA setDisabledState', () => {
        const instance: ZyraSwitch = fixture.debugElement.children[0].componentInstance;
        instance.setDisabledState(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-switch--disabled')).not.toBeNull();
    });
});

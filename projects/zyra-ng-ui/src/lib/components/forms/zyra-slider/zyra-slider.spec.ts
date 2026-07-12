import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ZyraSlider } from './zyra-slider';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraSlider],
    template: `
        <zyra-slider
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            [min]="min()"
            [max]="max()"
            [step]="step()"
            [showValue]="showValue()"
            [disabled]="disabled()"
        />
    `,
})
class SliderHostComponent {
    value = signal(0);
    min = signal(0);
    max = signal(100);
    step = signal(1);
    showValue = signal(false);
    disabled = signal(false);
}

function slider(fixture: ComponentFixture<unknown>): HTMLInputElement {
    return fixture.nativeElement.querySelector('.zyr-slider__input');
}

describe('ZyraSlider', () => {
    let fixture: ComponentFixture<SliderHostComponent>;
    let host: SliderHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SliderHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SliderHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('renders a native range input with min/max/step', () => {
        const el = slider(fixture);
        expect(el.type).toBe('range');
        expect(el.min).toBe('0');
        expect(el.max).toBe('100');
        expect(el.step).toBe('1');
    });

    it('reflects the initial value', async () => {
        host.value.set(40);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(slider(fixture).value).toBe('40');
    });

    it('updates the value on user input', () => {
        const el = slider(fixture);
        el.value = '75';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(host.value()).toBe(75);
    });

    it('emits changed on input', () => {
        const emitted: number[] = [];
        (fixture.debugElement.children[0].componentInstance as ZyraSlider).changed.subscribe(
            (v) => emitted.push(v),
        );

        const el = slider(fixture);
        el.value = '20';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(emitted).toEqual([20]);
    });

    it('shows the formatted value when showValue is true', async () => {
        host.value.set(55);
        host.showValue.set(true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const label: HTMLElement = fixture.nativeElement.querySelector('.zyr-slider__value');
        expect(label.textContent?.trim()).toBe('55');
    });

    it('hides the value label by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-slider__value')).toBeNull();
    });

    it('disables the input when disabled is true', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        expect(slider(fixture).disabled).toBeTrue();
    });

    it('respects custom min/max/step', () => {
        host.min.set(10);
        host.max.set(20);
        host.step.set(5);
        fixture.detectChanges();

        const el = slider(fixture);
        expect(el.min).toBe('10');
        expect(el.max).toBe('20');
        expect(el.step).toBe('5');
    });
});

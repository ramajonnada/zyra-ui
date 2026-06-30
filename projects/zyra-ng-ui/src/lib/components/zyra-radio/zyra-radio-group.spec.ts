import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ZyraRadio } from './zyra-radio';
import { ZyraRadioGroup } from './zyra-radio-group';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraRadioGroup, ZyraRadio],
    template: `
        <zyra-radio-group [(ngModel)]="value" [disabled]="disabled()" [orientation]="orientation()">
            <zyra-radio value="angular" label="Angular" />
            <zyra-radio value="react" label="React" />
            <zyra-radio value="vue" label="Vue" [disabled]="true" />
        </zyra-radio-group>
    `,
})
class RadioGroupHostComponent {
    value = signal<string | null>(null);
    disabled = signal(false);
    orientation = signal<'vertical' | 'horizontal'>('vertical');
}

describe('ZyraRadioGroup', () => {
    let fixture: ComponentFixture<RadioGroupHostComponent>;
    let host: RadioGroupHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RadioGroupHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(RadioGroupHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders all radio options', () => {
        expect(fixture.nativeElement.querySelectorAll('zyra-radio').length).toBe(3);
    });

    // ── Selection ─────────────────────────────────────────────────────────
    it('selects a radio on click and updates the bound value', () => {
        circles(fixture)[0].click();
        fixture.detectChanges();
        expect(host.value()).toBe('angular');
    });

    it('marks the selected radio with --checked class', async () => {
        circles(fixture)[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const radios: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-radio');
        expect(radios[1].classList).toContain('zyr-radio--checked');
        expect(radios[0].classList).not.toContain('zyr-radio--checked');
    });

    it('deselects previous radio when a new one is selected', async () => {
        circles(fixture)[0].click();
        fixture.detectChanges();
        circles(fixture)[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const radios: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-radio');
        expect(radios[0].classList).not.toContain('zyr-radio--checked');
        expect(radios[1].classList).toContain('zyr-radio--checked');
    });

    // ── Disabled option ───────────────────────────────────────────────────
    it('does not select a disabled radio option', () => {
        circles(fixture)[2].click();
        fixture.detectChanges();
        expect(host.value()).toBeNull();
    });

    it('applies --disabled class to the disabled radio', () => {
        const radios: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-radio');
        expect(radios[2].classList).toContain('zyr-radio--disabled');
    });

    // ── Disabled group ────────────────────────────────────────────────────
    it('does not select any radio when the group is disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        circles(fixture)[0].click();
        fixture.detectChanges();
        expect(host.value()).toBeNull();
    });

    it('applies --disabled class to all radios when group is disabled', () => {
        host.disabled.set(true);
        fixture.detectChanges();
        const radios: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-radio');
        radios.forEach((r) => expect(r.classList).toContain('zyr-radio--disabled'));
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('moves selection forward on ArrowDown (vertical)', async () => {
        circles(fixture)[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBe('react');
    });

    it('moves selection backward on ArrowUp (vertical)', async () => {
        circles(fixture)[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
        );
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBe('angular');
    });

    it('moves selection forward on ArrowRight (horizontal)', async () => {
        host.orientation.set('horizontal');
        fixture.detectChanges();
        circles(fixture)[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
        );
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBe('react');
    });

    it('wraps around from last to first on ArrowDown', async () => {
        circles(fixture)[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBe('angular');
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('has role="radiogroup"', () => {
        expect(fixture.nativeElement.querySelector('[role="radiogroup"]')).not.toBeNull();
    });

    it('each radio has role="radio"', () => {
        const roleRadios: NodeList = fixture.nativeElement.querySelectorAll('[role="radio"]');
        expect(roleRadios.length).toBe(3);
    });

    it('aria-checked is true for selected radio', async () => {
        circles(fixture)[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const roleRadios: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('[role="radio"]');
        expect(roleRadios[0].getAttribute('aria-checked')).toBe('true');
        expect(roleRadios[1].getAttribute('aria-checked')).toBe('false');
    });
});

function circles(f: ComponentFixture<RadioGroupHostComponent>): NodeListOf<HTMLButtonElement> {
    return f.nativeElement.querySelectorAll('.zyr-radio__circle');
}

function groupEl(f: ComponentFixture<RadioGroupHostComponent>): HTMLElement {
    return f.nativeElement.querySelector('zyra-radio-group');
}

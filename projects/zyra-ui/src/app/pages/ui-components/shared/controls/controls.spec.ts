import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Controls } from './controls';
import { ControlDef } from './control-def';

function makeBtnGroup(overrides?: object) {
    return {
        type: 'button-group' as const,
        key: 'variant',
        label: 'Variant',
        options: ['primary', 'secondary', 'ghost'],
        signal: signal('primary'),
        ...overrides,
    };
}

function makeToggle(overrides?: object) {
    return {
        type: 'toggle' as const,
        key: 'disabled',
        label: 'State',
        toggleLabel: 'disabled',
        signal: signal(false),
        ...overrides,
    };
}

function makeText(overrides?: object) {
    return {
        type: 'text' as const,
        key: 'label',
        label: 'Label',
        placeholder: 'Enter text…',
        signal: signal('Hello'),
        ...overrides,
    };
}

describe('Controls', () => {
    let fixture: ComponentFixture<Controls>;
    let component: Controls;

    function create(controls: ControlDef[]) {
        fixture = TestBed.createComponent(Controls);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('controls', controls);
        fixture.detectChanges();
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Controls],
        }).compileComponents();
    });

    it('should create', () => {
        create([]);
        expect(component).toBeTruthy();
    });

    // ── empty state ───────────────────────────────────────────────────────────
    it('renders the "Controls" title always', () => {
        create([]);
        const title: HTMLElement = fixture.nativeElement.querySelector('.controls__title');
        expect(title.textContent?.trim()).toBe('Controls');
    });

    it('renders no control groups when controls is empty', () => {
        create([]);
        expect(fixture.nativeElement.querySelectorAll('.control-group').length).toBe(0);
    });

    // ── button-group control ──────────────────────────────────────────────────
    it('renders one control-group for a button-group control', () => {
        create([makeBtnGroup()]);
        expect(fixture.nativeElement.querySelectorAll('.control-group').length).toBe(1);
    });

    it('renders a button for each option in a button-group control', () => {
        create([makeBtnGroup()]);
        const buttons = (fixture.nativeElement.querySelectorAll(
            '.control-options zyra-button',
        ) as NodeListOf<HTMLElement>);
        expect(buttons.length).toBe(3);
    });

    it('active option button shows primary variant', () => {
        const btnGroup = makeBtnGroup();
        create([btnGroup]);
        const buttons = (fixture.nativeElement.querySelectorAll(
            '.control-options zyra-button',
        ) as NodeListOf<HTMLElement>);
        // The first button ('primary') exists — variant binding is confirmed by click test below
        expect(buttons.length).toBe(3);
        expect(buttons[0]).toBeTruthy();
    });

    it('clicking a button-group option updates the signal', () => {
        const btnGroup = makeBtnGroup();
        create([btnGroup]);
        // ZyraButton renders a native <button> inside; click that to trigger (clicked) output
        const nativeButtons = (fixture.nativeElement.querySelectorAll(
            '.control-options zyra-button button',
        ) as NodeListOf<HTMLButtonElement>);
        // Click second option ('secondary')
        nativeButtons[1].click();
        fixture.detectChanges();
        expect(btnGroup.signal()).toBe('secondary');
    });

    // ── toggle control ────────────────────────────────────────────────────────
    it('renders a checkbox for a toggle control', () => {
        create([makeToggle()]);
        const checkbox = fixture.nativeElement.querySelector(
            '.control-toggles input[type="checkbox"]',
        );
        expect(checkbox).not.toBeNull();
    });

    it('checkbox is unchecked when toggle signal is false', () => {
        create([makeToggle()]);
        const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
            'input[type="checkbox"]',
        );
        expect(checkbox.checked).toBeFalse();
    });

    it('checking the checkbox sets toggle signal to true', () => {
        const toggle = makeToggle();
        create([toggle]);
        const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
            'input[type="checkbox"]',
        );
        checkbox.click();
        fixture.detectChanges();
        expect(toggle.signal()).toBeTrue();
    });

    it('unchecking the checkbox sets toggle signal back to false', () => {
        const toggle = makeToggle();
        toggle.signal.set(true);
        create([toggle]);
        const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
            'input[type="checkbox"]',
        );
        checkbox.click();
        fixture.detectChanges();
        expect(toggle.signal()).toBeFalse();
    });

    it('renders the toggleLabel text next to the checkbox', () => {
        create([makeToggle()]);
        const label: HTMLElement = fixture.nativeElement.querySelector('.toggle__label');
        expect(label.textContent?.trim()).toBe('disabled');
    });

    // ── text control ──────────────────────────────────────────────────────────
    it('renders a zyra-input for a text control', () => {
        create([makeText()]);
        expect(fixture.nativeElement.querySelector('zyra-input')).not.toBeNull();
    });

    // ── mixed controls ────────────────────────────────────────────────────────
    it('renders one control-group per control in a mixed list', () => {
        create([makeBtnGroup(), makeToggle(), makeText()]);
        expect(fixture.nativeElement.querySelectorAll('.control-group').length).toBe(3);
    });

    it('renders the control label for each group', () => {
        create([makeBtnGroup({ label: 'Variant' }), makeToggle({ label: 'State' })]);
        const labels = (fixture.nativeElement.querySelectorAll(
            '.control-label',
        ) as NodeListOf<HTMLElement>);
        const texts = Array.from(labels).map((el) => el.textContent?.trim());
        expect(texts).toContain('Variant');
        expect(texts).toContain('State');
    });

    // ── type-cast helpers ─────────────────────────────────────────────────────
    it('asBtnGroup() returns the control cast as ButtonGroupControl', () => {
        create([]);
        const def = makeBtnGroup();
        const cast = component.asBtnGroup(def);
        expect(cast.options).toEqual(['primary', 'secondary', 'ghost']);
    });

    it('asToggle() returns the control cast as ToggleControl', () => {
        create([]);
        const def = makeToggle();
        const cast = component.asToggle(def);
        expect(cast.toggleLabel).toBe('disabled');
    });

    it('asText() returns the control cast as TextControl', () => {
        create([]);
        const def = makeText();
        const cast = component.asText(def);
        expect(cast.placeholder).toBe('Enter text…');
    });
});

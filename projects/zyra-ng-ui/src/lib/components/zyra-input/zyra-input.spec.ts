import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraInput } from './zyra-input';

describe('ZyraInput', () => {
    let fixture: ComponentFixture<ZyraInput>;
    let component: ZyraInput;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [ZyraInput] }).compileComponents();
        fixture = TestBed.createComponent(ZyraInput);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Value binding ─────────────────────────────────────────────────────
    it('emits valueChange on user input', async () => {
        const emitted: string[] = [];
        component.valueChange.subscribe((v) => emitted.push(v));

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.value = 'hello';
        input.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.innerValue()).toBe('hello');
        expect(emitted).toEqual(['hello']);
    });

    it('sets value via writeValue', async () => {
        component.writeValue('prefilled');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.innerValue()).toBe('prefilled');
        expect(fixture.nativeElement.querySelector('input').value).toBe('prefilled');
    });

    it('clears value to empty string on writeValue(null)', () => {
        component.writeValue(null as unknown as string);
        fixture.detectChanges();
        expect(component.innerValue()).toBe('');
    });

    // ── Focus / blur ──────────────────────────────────────────────────────
    it('tracks focus and blur state', () => {
        let focusCount = 0;
        let blurCount = 0;
        component.focused.subscribe(() => focusCount++);
        component.blurred.subscribe(() => blurCount++);

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new Event('focus'));
        fixture.detectChanges();
        expect(component.isFocused()).toBeTrue();

        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.isFocused()).toBeFalse();
        expect(component.isTouched()).toBeTrue();
        expect(focusCount).toBe(1);
        expect(blurCount).toBe(1);
    });

    // ── Password toggle ───────────────────────────────────────────────────
    it('toggles input type between password and text', () => {
        fixture.componentRef.setInput('type', 'password');
        component.writeValue('secret');
        fixture.detectChanges();

        component.togglePassword();
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(input.type).toBe('text');

        component.togglePassword();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input').type).toBe('password');
    });

    // ── Clear ─────────────────────────────────────────────────────────────
    it('clears value via clear()', () => {
        component.writeValue('some text');
        fixture.detectChanges();

        component.clear();
        fixture.detectChanges();

        expect(component.innerValue()).toBe('');
        expect(fixture.nativeElement.querySelector('input').value).toBe('');
    });

    // ── Disabled state ────────────────────────────────────────────────────
    it('disables the input via setDisabledState', async () => {
        component.setDisabledState(true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('input').disabled).toBeTrue();
    });

    // ── Size ──────────────────────────────────────────────────────────────
    it('applies size class to input element', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(input.className).toContain('zyr-input--lg');
    });

    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('input').className).toContain('zyr-input--md');
    });

    // ── Placeholder ───────────────────────────────────────────────────────
    it('sets placeholder attribute', () => {
        fixture.componentRef.setInput('placeholder', 'Enter email');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input').placeholder).toBe('Enter email');
    });

    // ── Readonly ──────────────────────────────────────────────────────────
    it('sets readonly attribute when readonly is true', async () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input').readOnly).toBeTrue();
    });

    // ── Maxlength ─────────────────────────────────────────────────────────
    it('sets maxlength attribute', () => {
        fixture.componentRef.setInput('maxlength', 20);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input').maxLength).toBe(20);
    });

    // ── Type ──────────────────────────────────────────────────────────────
    it('sets email type', () => {
        fixture.componentRef.setInput('type', 'email');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input').type).toBe('email');
    });

    it('sets number type', () => {
        fixture.componentRef.setInput('type', 'number');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input').type).toBe('number');
    });

    // ── CVA callbacks ─────────────────────────────────────────────────────
    it('calls onChange callback when value changes', () => {
        let changed = '';
        component.registerOnChange((v: string) => (changed = v));

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.value = 'test';
        input.dispatchEvent(new Event('input'));

        expect(changed).toBe('test');
    });

    it('calls onTouched callback on blur', () => {
        let touched = false;
        component.registerOnTouched(() => (touched = true));

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(touched).toBeTrue();
    });

    // ── Unique ID ─────────────────────────────────────────────────────────
    it('generates a unique inputId', () => {
        expect(component.inputId).toMatch(/^zyra-input-\d+$/);
    });

    it('uses provided id input over generated id', async () => {
        fixture.componentRef.setInput('id', 'my-custom-id');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.resolvedId()).toBe('my-custom-id');
    });
});

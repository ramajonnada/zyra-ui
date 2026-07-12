import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraTextarea } from './zyra-textarea';

describe('ZyraTextarea', () => {
    let fixture: ComponentFixture<ZyraTextarea>;
    let component: ZyraTextarea;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [ZyraTextarea] }).compileComponents();
        fixture = TestBed.createComponent(ZyraTextarea);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Value binding ─────────────────────────────────────────────────────
    it('emits valueChange on user input', async () => {
        const emitted: string[] = [];
        component.valueChange.subscribe((v) => emitted.push(v));

        const ta: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
        ta.value = 'hello world';
        ta.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.innerValue()).toBe('hello world');
        expect(emitted).toEqual(['hello world']);
    });

    it('sets value via writeValue', async () => {
        component.writeValue('prefilled text');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.innerValue()).toBe('prefilled text');
        expect(fixture.nativeElement.querySelector('textarea').value).toBe('prefilled text');
    });

    it('clears value to empty string on writeValue(null)', () => {
        component.writeValue(null as unknown as string);
        fixture.detectChanges();
        expect(component.innerValue()).toBe('');
    });

    // ── Clear ─────────────────────────────────────────────────────────────
    it('clears value via clear()', async () => {
        component.writeValue('some text');
        fixture.detectChanges();
        component.clear();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.innerValue()).toBe('');
    });

    // ── Focus / blur ──────────────────────────────────────────────────────
    it('tracks focus and blur state', () => {
        let focusCount = 0;
        let blurCount = 0;
        component.focused.subscribe(() => focusCount++);
        component.blurred.subscribe(() => blurCount++);

        const ta: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
        ta.dispatchEvent(new Event('focus'));
        fixture.detectChanges();
        expect(component.isFocused()).toBeTrue();

        ta.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.isFocused()).toBeFalse();
        expect(component.isTouched()).toBeTrue();
        expect(focusCount).toBe(1);
        expect(blurCount).toBe(1);
    });

    // ── Size ──────────────────────────────────────────────────────────────
    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('textarea').className).toContain(
            'zyr-textarea--md',
        );
    });

    it('applies sm size class', () => {
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').className).toContain(
            'zyr-textarea--sm',
        );
    });

    it('applies lg size class', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').className).toContain(
            'zyr-textarea--lg',
        );
    });

    // ── Resize ────────────────────────────────────────────────────────────
    it('applies vertical resize class by default', () => {
        expect(fixture.nativeElement.querySelector('textarea').className).toContain(
            'zyr-textarea--resize-vertical',
        );
    });

    it('applies none resize class', () => {
        fixture.componentRef.setInput('resize', 'none');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').className).toContain(
            'zyr-textarea--resize-none',
        );
    });

    it('applies auto resize class', () => {
        fixture.componentRef.setInput('resize', 'auto');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').className).toContain(
            'zyr-textarea--resize-auto',
        );
    });

    // ── Rows ──────────────────────────────────────────────────────────────
    it('sets rows attribute on the native textarea', () => {
        fixture.componentRef.setInput('rows', 6);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').rows).toBe(6);
    });

    it('defaults to 3 rows', () => {
        expect(fixture.nativeElement.querySelector('textarea').rows).toBe(3);
    });

    // ── Placeholder ───────────────────────────────────────────────────────
    it('sets placeholder attribute', () => {
        fixture.componentRef.setInput('placeholder', 'Write a comment…');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').placeholder).toBe(
            'Write a comment…',
        );
    });

    // ── Maxlength ─────────────────────────────────────────────────────────
    it('sets maxlength attribute', () => {
        fixture.componentRef.setInput('maxlength', 200);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').maxLength).toBe(200);
    });

    // ── Readonly ──────────────────────────────────────────────────────────
    it('sets readonly attribute when readonly is true', async () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').readOnly).toBeTrue();
    });

    // ── Disabled ──────────────────────────────────────────────────────────
    it('disables the native element when setDisabledState is called', async () => {
        component.setDisabledState(true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('textarea').disabled).toBeTrue();
    });

    // ── CVA callbacks ─────────────────────────────────────────────────────
    it('calls onChange callback when value changes', () => {
        let changed = '';
        component.registerOnChange((v: string) => (changed = v));

        const ta: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
        ta.value = 'typed text';
        ta.dispatchEvent(new Event('input'));

        expect(changed).toBe('typed text');
    });

    it('calls onTouched callback on blur', () => {
        let touched = false;
        component.registerOnTouched(() => (touched = true));

        fixture.nativeElement.querySelector('textarea').dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(touched).toBeTrue();
    });

    // ── Unique ID ─────────────────────────────────────────────────────────
    it('generates a unique textareaId', () => {
        expect(component.textareaId).toMatch(/^zyra-textarea-\d+$/);
    });

    it('uses provided id over generated id', async () => {
        fixture.componentRef.setInput('id', 'my-textarea');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.resolvedId()).toBe('my-textarea');
    });
});

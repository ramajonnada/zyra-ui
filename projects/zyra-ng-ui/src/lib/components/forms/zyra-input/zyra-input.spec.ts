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
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
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

    // ── Debounced search ──────────────────────────────────────────────────
    it('does not emit search when debounce is 0 (default)', () => {
        const emitted: string[] = [];
        component.search.subscribe((v) => emitted.push(v));

        component.onModelChange('abc');
        jasmine.clock().tick(1000);

        expect(emitted).toEqual([]);
    });

    it('emits search only after debounce interval elapses', () => {
        fixture.componentRef.setInput('debounce', 300);
        const emitted: string[] = [];
        component.search.subscribe((v) => emitted.push(v));

        component.onModelChange('a');
        component.onModelChange('ab');
        component.onModelChange('abc');
        expect(emitted).toEqual([]);

        jasmine.clock().tick(300);
        expect(emitted).toEqual(['abc']);
    });

    it('emits search("") immediately on clear() when debounce is enabled', () => {
        fixture.componentRef.setInput('debounce', 300);
        const emitted: string[] = [];
        component.search.subscribe((v) => emitted.push(v));

        component.onModelChange('term');
        component.clear();
        jasmine.clock().tick(300);

        expect(emitted).toEqual(['']);
    });

    // ── Escape-to-clear on search fields ────────────────────────────────
    it('clears a search-type field on Escape when it has a value', () => {
        fixture.componentRef.setInput('type', 'search');
        component.writeValue('term');
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();

        expect(component.innerValue()).toBe('');
    });

    it('does not clear a non-search field on Escape', () => {
        component.writeValue('term');
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();

        expect(component.innerValue()).toBe('term');
    });

    // ── OTP mode ────────────────────────────────────────────────────────────
    describe('OTP mode', () => {
        function boxes(): HTMLInputElement[] {
            return Array.from(fixture.nativeElement.querySelectorAll('.zyr-otp__box'));
        }

        beforeEach(() => {
            fixture.componentRef.setInput('otpLength', 4);
            fixture.detectChanges();
        });

        it('renders one box per otpLength', () => {
            expect(boxes().length).toBe(4);
        });

        it('renders the standard single input when otpLength is not set', () => {
            fixture.componentRef.setInput('otpLength', null);
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelectorAll('.zyr-otp__box').length).toBe(0);
            expect(fixture.nativeElement.querySelector('input.zyr-input')).not.toBeNull();
        });

        it('types a digit into a box and advances focus to the next box', () => {
            const b = boxes();
            b[0].value = '1';
            b[0].dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(component.otpCharAt(0)).toBe('1');
            expect(document.activeElement).toBe(boxes()[1]);
        });

        it('rejects a non-numeric character in numeric mode', () => {
            const b = boxes();
            b[0].value = 'x';
            b[0].dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(component.otpCharAt(0)).toBe('');
        });

        it('accepts letters in alphanumeric mode', () => {
            fixture.componentRef.setInput('otpType', 'alphanumeric');
            fixture.detectChanges();

            const b = boxes();
            b[0].value = 'a';
            b[0].dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(component.otpCharAt(0)).toBe('a');
        });

        it('moves focus back and clears the previous box on Backspace when current box is empty', () => {
            const b = boxes();
            b[0].value = '1';
            b[0].dispatchEvent(new Event('input'));
            fixture.detectChanges();

            boxes()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
            fixture.detectChanges();

            expect(component.otpCharAt(0)).toBe('');
            expect(document.activeElement).toBe(boxes()[0]);
        });

        it('navigates between boxes with ArrowLeft/ArrowRight', () => {
            const b = boxes();
            b[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            fixture.detectChanges();
            expect(document.activeElement).toBe(boxes()[1]);

            boxes()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
            fixture.detectChanges();
            expect(document.activeElement).toBe(boxes()[0]);
        });

        it('distributes a pasted code across the boxes', () => {
            const clipboardData = { getData: () => '1234' } as unknown as DataTransfer;
            boxes()[0].dispatchEvent(
                Object.assign(new Event('paste'), { clipboardData }) as ClipboardEvent,
            );
            fixture.detectChanges();

            expect(['1', '2', '3', '4']).toEqual([0, 1, 2, 3].map((i) => component.otpCharAt(i)));
        });

        it('emits complete once every box is filled', () => {
            let completed = '';
            component.complete.subscribe((v) => (completed = v));

            const clipboardData = { getData: () => '5678' } as unknown as DataTransfer;
            boxes()[0].dispatchEvent(
                Object.assign(new Event('paste'), { clipboardData }) as ClipboardEvent,
            );
            fixture.detectChanges();

            expect(completed).toBe('5678');
        });

        it('populates boxes from writeValue', () => {
            component.writeValue('42');
            fixture.detectChanges();

            expect(component.otpCharAt(0)).toBe('4');
            expect(component.otpCharAt(1)).toBe('2');
            expect(component.otpCharAt(2)).toBe('');
        });
    });
});

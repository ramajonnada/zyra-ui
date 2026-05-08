import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraInput } from './zyra-input';

describe('ZyraInput', () => {
    let fixture: ComponentFixture<ZyraInput>;
    let component: ZyraInput;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZyraInput],
        }).compileComponents();

        fixture = TestBed.createComponent(ZyraInput);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('emits value changes from user input', async () => {
        const emitted: string[] = [];
        component.valueChange.subscribe((value) => emitted.push(value));

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.value = 'hello';
        input.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.innerValue()).toBe('hello');
        expect(emitted).toEqual(['hello']);
    });

    it('tracks focus and blur like an end user interaction', () => {
        let focusedCount = 0;
        let blurredCount = 0;
        component.focused.subscribe(() => focusedCount++);
        component.blurred.subscribe(() => blurredCount++);

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new Event('focus'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(component.isFocused()).toBeFalse();
        expect(component.isTouched()).toBeTrue();
        expect(focusedCount).toBe(1);
        expect(blurredCount).toBe(1);
    });

    it('supports password toggling and clearing', () => {
        fixture.componentRef.setInput('type', 'password');
        component.writeValue('secret');
        fixture.detectChanges();

        component.togglePassword();
        fixture.detectChanges();

        let input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(input.type).toBe('text');

        component.clear();
        fixture.detectChanges();

        input = fixture.nativeElement.querySelector('input');
        expect(component.innerValue()).toBe('');
        expect(input.value).toBe('');
    });
});

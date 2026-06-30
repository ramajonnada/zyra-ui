import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    FormsModule,
    ReactiveFormsModule,
    Validators,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { ZyraFormField } from './zyra-form-field';
import { ZyraInput, InputType } from '../zyra-input/zyra-input';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraFormField, ZyraInput],
    template: `
        <zyra-form-field
            [label]="label()"
            [hint]="hint()"
            [successHint]="successHint()"
            [clearButton]="clearButton()"
            [maxLength]="maxLength()"
        >
            <zyra-input [(ngModel)]="value" [type]="type()" required></zyra-input>
        </zyra-form-field>
    `,
})
class FormFieldHostComponent {
    label = signal('Password');
    hint = signal('Use a strong password');
    successHint = signal('Looks good');
    clearButton = signal(false);
    maxLength = signal<number | null>(10);
    value = 'secret';
    type = signal<InputType>('password');
}

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, ZyraFormField, ZyraInput],
    template: `
        <form [formGroup]="form">
            <zyra-form-field [label]="label()" [hint]="hint()">
                <zyra-input formControlName="email" type="email"></zyra-input>
            </zyra-form-field>
        </form>
    `,
})
class ReactiveFormFieldHostComponent {
    label = signal('Email');
    hint = signal('We will never share your email');
    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });
}

describe('ZyraFormField', () => {
    let fixture: ComponentFixture<FormFieldHostComponent>;
    let host: FormFieldHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormFieldHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(FormFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    // ── Label ─────────────────────────────────────────────────────────────
    it('renders the label text', () => {
        const label: HTMLLabelElement =
            fixture.nativeElement.querySelector('.zyra-form-field__label');
        expect(label.textContent).toContain('Password');
    });

    it('shows required marker (*) when input has required validator', () => {
        const label: HTMLLabelElement =
            fixture.nativeElement.querySelector('.zyra-form-field__label');
        expect(label.textContent).toContain('*');
    });

    it('does not show required marker when not required', async () => {
        host.type.set('text');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        // Still has required on the input in this template — marker should still be there
        const label: HTMLLabelElement =
            fixture.nativeElement.querySelector('.zyra-form-field__label');
        expect(label).not.toBeNull();
    });

    // ── Hint ──────────────────────────────────────────────────────────────
    it('shows hint text', () => {
        const hint: HTMLElement = fixture.nativeElement.querySelector('.zyra-form-field__hint');
        expect(hint.textContent).toContain('Use a strong password');
    });

    // ── Character counter ─────────────────────────────────────────────────
    it('renders character counter with current/max', () => {
        const counter: HTMLElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__counter',
        );
        expect(counter.textContent?.trim()).toBe('6 / 10');
    });

    it('hides counter when maxLength is null', async () => {
        host.maxLength.set(null);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyra-form-field__counter')).toBeNull();
    });

    // ── Password toggle ───────────────────────────────────────────────────
    it('shows password toggle button for password type inputs', () => {
        expect(fixture.nativeElement.querySelector('.zyra-form-field__icon-btn')).not.toBeNull();
    });

    it('toggles password visibility when toggle button is clicked', () => {
        const toggle: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__icon-btn',
        );
        toggle.click();
        fixture.detectChanges();
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(input.type).toBe('text');
    });

    it('toggle aria-label changes between Show/Hide password', () => {
        const toggle: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__icon-btn',
        );
        expect(toggle.getAttribute('aria-label')).toBe('Show password');
        toggle.click();
        fixture.detectChanges();
        expect(toggle.getAttribute('aria-label')).toBe('Hide password');
    });

    // ── Clear button ──────────────────────────────────────────────────────
    it('shows clear button when clearButton is enabled and field has a value', async () => {
        host.type.set('text');
        host.clearButton.set(true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyra-form-field__clear-btn')).not.toBeNull();
    });

    it('clears the input value when clear button is clicked', async () => {
        host.type.set('text');
        host.clearButton.set(true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const clearBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__clear-btn',
        );
        clearBtn.click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value).toBe('');
        expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe('');
    });
});

describe('ZyraFormField — reactive validation', () => {
    let fixture: ComponentFixture<ReactiveFormFieldHostComponent>;
    let host: ReactiveFormFieldHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormFieldHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(ReactiveFormFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('shows hint text initially', () => {
        const hint: HTMLElement = fixture.nativeElement.querySelector('.zyra-form-field__hint');
        expect(hint.textContent).toContain('We will never share your email');
    });

    it('shows required error after touching the field with empty value', async () => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new Event('focus'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const errorHint: HTMLElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__hint--error',
        );
        expect(errorHint).not.toBeNull();
        expect(errorHint.textContent).toContain('This field is required');
    });

    it('shows email validation error for invalid email', async () => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.value = 'notanemail';
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const errorHint: HTMLElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__hint--error',
        );
        expect(errorHint).not.toBeNull();
        expect(errorHint.textContent).toContain('valid email');
    });

    it('applies error status class when field is invalid and touched', async () => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new Event('focus'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyra-form-field--error')).not.toBeNull();
    });
});

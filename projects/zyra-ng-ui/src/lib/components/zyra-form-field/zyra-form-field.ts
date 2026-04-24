// projects/zyra-ng-ui/src/lib/form-field/zyra-form-field.ts

import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ContentChild,
    inject,
    input,
    signal,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ZyraSpinner } from '../zyra-spinner/zyra-spinner';
import { ZyraInput } from '../zyra-input/zyra-input';

export type FormFieldAppearance = 'outline' | 'filled' | 'underline';
export type FormFieldSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'zyra-form-field',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSpinner],
    templateUrl: './zyra-form-field.html',
    styleUrl: './zyra-form-field.scss',
})
export class ZyraFormField implements AfterContentInit {
    // ── Inputs ────────────────────────────────────────────────
    label = input<string>('');
    hint = input<string>('');
    successHint = input<string>('');
    prefixIcon = input<string>('');
    suffixIcon = input<string>('');
    appearance = input<FormFieldAppearance>('outline');
    size = input<FormFieldSize>('md');
    maxLength = input<number | null>(null);
    clearButton = input<boolean>(false);
    loading = input<boolean>(false);

    // ── Get projected zyra-input child ────────────────────────
    @ContentChild(ZyraInput) zyraInput!: ZyraInput;

    private cdr = inject(ChangeDetectorRef);

    ngAfterContentInit(): void {
        if (!this.zyraInput) return;

        // Pass size down to child input
        // Subscribe to child events to trigger change detection
        this.zyraInput.focused.subscribe(() => this.cdr.markForCheck());
        this.zyraInput.blurred.subscribe(() => this.cdr.markForCheck());
        this.zyraInput.valueChange.subscribe(() => this.cdr.markForCheck());
    }

    // ── Helpers to read child state ───────────────────────────
    private get ctrl(): AbstractControl | null {
        return this.zyraInput?.ngControl?.control ?? null;
    }

    get isFocused(): boolean {
        return this.zyraInput?.isFocused() ?? false;
    }

    get isTouched(): boolean {
        return this.zyraInput?.isTouched() ?? false;
    }

    get isDisabled(): boolean {
        return this.zyraInput?.isDisabled() ?? false;
    }

    get isPassword(): boolean {
        return this.zyraInput?.type() === 'password';
    }

    get showPasswordToggle(): boolean {
        return this.isPassword;
    }

    get showingPassword(): boolean {
        return this.zyraInput?.showPassword() ?? false;
    }

    get currentLength(): number {
        return this.zyraInput?.innerValue()?.length ?? 0;
    }

    get hasValue(): boolean {
        return !!this.zyraInput?.innerValue();
    }

    // ── Form state ────────────────────────────────────────────
    get isRequired(): boolean {
        const ctrl = this.ctrl;
        if (!ctrl?.validator) return false;
        const errors = ctrl.validator({} as AbstractControl);
        return !!errors?.['required'];
    }

    get showError(): boolean {
        const ctrl = this.ctrl;
        if (!ctrl) return false;
        return ctrl.invalid && (ctrl.touched || this.isTouched);
    }

    get showSuccess(): boolean {
        const ctrl = this.ctrl;
        if (!ctrl) return false;
        return ctrl.valid && (ctrl.touched || this.isTouched) && this.hasValue;
    }

    get isPending(): boolean {
        return this.ctrl?.pending ?? false;
    }

    get errorMessage(): string {
        const errors: ValidationErrors | null = this.ctrl?.errors ?? null;
        if (!errors) return '';
        if (errors['required']) return 'This field is required';
        if (errors['email']) return 'Please enter a valid email address';
        if (errors['minlength'])
            return `Minimum ${errors['minlength'].requiredLength} characters required (${errors['minlength'].actualLength} entered)`;
        if (errors['maxlength'])
            return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
        if (errors['min']) return `Minimum value is ${errors['min'].min}`;
        if (errors['max']) return `Maximum value is ${errors['max'].max}`;
        if (errors['pattern']) return 'Invalid format';
        const firstKey = Object.keys(errors)[0];
        if (errors[firstKey]?.message) return errors[firstKey].message;
        return 'Invalid value';
    }

    // ── Status for border/glow ────────────────────────────────
    get status(): 'default' | 'focused' | 'success' | 'error' | 'disabled' {
        if (this.isDisabled) return 'disabled';
        if (this.showError) return 'error';
        if (this.showSuccess) return 'success';
        if (this.isFocused) return 'focused';
        return 'default';
    }

    // ── Host CSS classes ──────────────────────────────────────
    get wrapClass(): string {
        const classes = [
            'zyra-form-field',
            `zyra-form-field--${this.appearance()}`,
            `zyra-form-field--${this.size()}`,
            `zyra-form-field--${this.status}`,
        ];
        if (this.prefixIcon()) classes.push('zyra-form-field--has-prefix');
        if (this.hasSuffix) classes.push('zyra-form-field--has-suffix');
        return classes.join(' ');
    }

    get hasSuffix(): boolean {
        return !!(
            this.suffixIcon() ||
            this.showPasswordToggle ||
            this.clearButton() ||
            this.loading() ||
            this.isPending
        );
    }

    // ── Actions ───────────────────────────────────────────────
    onClear(): void {
        this.zyraInput?.clear();
        this.cdr.markForCheck();
    }

    onTogglePassword(): void {
        this.zyraInput?.togglePassword();
        this.cdr.markForCheck();
    }
}

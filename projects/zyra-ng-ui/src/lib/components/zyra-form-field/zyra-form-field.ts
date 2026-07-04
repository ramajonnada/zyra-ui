// projects/zyra-ng-ui/src/lib/form-field/zyra-form-field.ts

import {
    AfterContentInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    Directive,
    inject,
    input,
} from '@angular/core';

@Directive({ selector: '[zyraPrefix]', standalone: true })
export class ZyraPrefix {}

@Directive({ selector: '[zyraSuffix]', standalone: true })
export class ZyraSuffix {}
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ZyraIcon as ZyraIconComponent, type ZyraIconData } from '../../internal/zyra-icon/zyra-icon';
import { ZyraSpinner } from '../zyra-spinner/zyra-spinner';
import { ZyraInput } from '../zyra-input/zyra-input';
import { ZyraTextarea } from '../zyra-textarea/zyra-textarea';
import {
    isLucideIcon,
    asIconText,
    check,
    eye,
    eyeSlash,
    xmark,
    type ZyraIconInput,
} from '../../shared/zyra-icons';

export type FormFieldAppearance = 'outline' | 'filled' | 'underline';
export type FormFieldSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'zyra-form-field',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSpinner, ZyraIconComponent],
    templateUrl: './zyra-form-field.html',
    styleUrl: './zyra-form-field.scss',
})
export class ZyraFormField implements AfterContentInit {
    // ── Inputs ────────────────────────────────────────────────
    label = input<string>('');
    hint = input<string>('');
    successHint = input<string>('');
    prefixIcon = input<ZyraIconInput>('');
    suffixIcon = input<ZyraIconInput>('');
    appearance = input<FormFieldAppearance>('outline');
    size = input<FormFieldSize>('md');
    maxLength = input<number | null>(null);
    clearButton = input(false, { transform: booleanAttribute });
    loading = input(false, { transform: booleanAttribute });

    // ── Get projected child (input or textarea) ──────────────
    @ContentChild(ZyraInput) zyraInput!: ZyraInput;
    @ContentChild(ZyraTextarea) zyraTextarea!: ZyraTextarea;
    @ContentChild(ZyraPrefix) _customPrefix: ZyraPrefix | null = null;
    @ContentChild(ZyraSuffix) _customSuffix: ZyraSuffix | null = null;

    private cdr = inject(ChangeDetectorRef);
    readonly icons = { check, eye, eyeSlash, xmark };

    // ── Unified child accessor ────────────────────────────────
    private get _child(): ZyraInput | ZyraTextarea | null {
        return this.zyraInput ?? this.zyraTextarea ?? null;
    }

    get childResolvedId(): string {
        return this._child?.resolvedId() ?? '';
    }

    ngAfterContentInit(): void {
        const child = this._child;
        if (!child) return;
        child.focused.subscribe(() => this.cdr.markForCheck());
        child.blurred.subscribe(() => this.cdr.markForCheck());
        child.valueChange.subscribe(() => this.cdr.markForCheck());
    }

    // ── Helpers to read child state ───────────────────────────
    private get ctrl(): AbstractControl | null {
        return this._child?.ngControl?.control ?? null;
    }

    get isFocused(): boolean {
        return this._child?.isFocused() ?? false;
    }

    get isTouched(): boolean {
        return this._child?.isTouched() ?? false;
    }

    get isDisabled(): boolean {
        return this._child?.isDisabled() ?? false;
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
        return this._child?.innerValue()?.length ?? 0;
    }

    get hasValue(): boolean {
        return !!this._child?.innerValue();
    }

    get prefixIconData(): ZyraIconData | null {
        const v = this.prefixIcon();
        return isLucideIcon(v) ? (v as ZyraIconData) : null;
    }

    get prefixIconText(): string | null {
        return asIconText(this.prefixIcon());
    }

    get suffixIconData(): ZyraIconData | null {
        const v = this.suffixIcon();
        return isLucideIcon(v) ? (v as ZyraIconData) : null;
    }

    get suffixIconText(): string | null {
        return asIconText(this.suffixIcon());
    }

    get hasPrefix(): boolean {
        return !!(this.prefixIconData || this.prefixIconText || this._customPrefix);
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
        if (this.hasPrefix) classes.push('zyra-form-field--has-prefix');
        if (this.hasSuffix) classes.push('zyra-form-field--has-suffix');
        return classes.join(' ');
    }

    get hasSuffix(): boolean {
        return !!(
            this.suffixIconData ||
            this.suffixIconText ||
            this._customSuffix ||
            this.showPasswordToggle ||
            this.clearButton() ||
            this.loading() ||
            this.isPending
        );
    }

    // ── Actions ───────────────────────────────────────────────
    onClear(): void {
        this._child?.clear();
        this.cdr.markForCheck();
    }

    onTogglePassword(): void {
        this.zyraInput?.togglePassword();
        this.cdr.markForCheck();
    }
}

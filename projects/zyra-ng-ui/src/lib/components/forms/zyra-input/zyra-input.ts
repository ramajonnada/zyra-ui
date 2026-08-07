// projects/zyra-ng-ui/src/lib/input/zyra-input.ts

import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    forwardRef,
    inject,
    Injector,
    input,
    OnDestroy,
    OnInit,
    output,
    signal,
    viewChildren,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import type { ZyraSize } from '../../../shared/zyra-size';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type InputSize = ZyraSize;
export type OtpType = 'numeric' | 'alphanumeric';

let inputIdCounter = 0;

@Component({
    selector: 'zyra-input',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraInput),
            multi: true,
        },
    ],
    templateUrl: './zyra-input.html',
    styleUrl: './zyra-input.scss',
})
export class ZyraInput implements ControlValueAccessor, OnInit, OnDestroy {
    // ── Inputs ────────────────────────────────────────────────
    type = input<InputType>('text');
    size = input<InputSize>('md');
    placeholder = input<string>('');
    readonly = input(false, { transform: booleanAttribute });
    id = input<string>('');
    maxlength = input<number | null>(null);
    min = input<number | null>(null);
    max = input<number | null>(null);
    // Milliseconds to wait after the last keystroke before emitting `searched`. 0 = disabled.
    debounce = input<number>(0);
    // Set to render as N separate one-time-passcode boxes instead of a single field.
    otpLength = input<number | null>(null);
    otpType = input<OtpType>('numeric');

    // ── Outputs ───────────────────────────────────────────────
    valueChange = output<string>();
    // Emits `debounce` ms after the user stops typing (only when debounce > 0).
    searched = output<string>();
    /**
     * @deprecated Use `searched` instead — this name shadows the native DOM
     * `search` event. Kept as a deprecated alias (emits alongside `searched`)
     * so renaming it isn't a breaking change in a patch release; will be
     * removed in a future major version.
     */
    // eslint-disable-next-line @angular-eslint/no-output-native
    search = output<string>();
    focused = output<void>();
    blurred = output<void>();
    // OTP mode only — emits once every box has a character.
    complete = output<string>();

    // ── Internal state ────────────────────────────────────────
    innerValue = signal('');
    isFocused = signal(false);
    isTouched = signal(false);
    isDisabled = signal(false);
    showPassword = signal(false);

    // ── OTP mode ──────────────────────────────────────────────
    isOtp = computed(() => (this.otpLength() ?? 0) > 0);
    otpBoxIndexes = computed(() => Array.from({ length: this.otpLength() ?? 0 }, (_, i) => i));
    private otpChars = signal<string[]>([]);
    private _otpBoxes = viewChildren<ElementRef<HTMLInputElement>>('otpBox');

    // ── Unique ID — used by zyra-form-field to link label ─────
    readonly inputId = `zyra-input-${++inputIdCounter}`;
    resolvedId = computed(() => this.id() || this.inputId);

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: string) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    // ── Debounce timer ───────────────────────────────────────
    private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // ── ControlValueAccessor ──────────────────────────────────
    writeValue(val: string): void {
        const v = val ?? '';
        this.innerValue.set(v);
        if (this.isOtp()) {
            const length = this.otpLength() ?? 0;
            this.otpChars.set(Array.from({ length }, (_, i) => v[i] ?? ''));
        }
    }

    registerOnChange(fn: (val: string) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    // ── Lazy NgControl injection — avoids NG0200 circular DI ──
    private _injector = inject(Injector);
    private _ngControl: NgControl | null = null;

    ngOnInit(): void {
        this._ngControl = this._injector.get(NgControl, null, {
            self: true,
            optional: true,
        });
    }

    // ── Expose NgControl for zyra-form-field to read ──────────
    get ngControl(): NgControl | null {
        return this._ngControl;
    }

    ngOnDestroy(): void {
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
    }

    // ── Event handlers ────────────────────────────────────────
    onModelChange(val: string): void {
        this.innerValue.set(val);
        this._onChange(val);
        this.valueChange.emit(val);
        this._scheduleSearch(val);
    }

    onFocus(): void {
        this.isFocused.set(true);
        this.focused.emit();
    }

    onBlur(): void {
        this.isFocused.set(false);
        this.isTouched.set(true);
        this._onTouched();
        this.blurred.emit();
    }

    // ── Escape clears search fields, matching native browser search inputs ──
    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.type() === 'search' && this.innerValue()) {
            event.stopPropagation();
            this.clear();
        }
    }

    // ── Called by zyra-form-field to clear value ──────────────
    clear(): void {
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this.innerValue.set('');
        this._onChange('');
        this.valueChange.emit('');
        if (this.debounce() > 0) {
            this.searched.emit('');
            this.search.emit('');
        }
    }

    private _scheduleSearch(val: string): void {
        if (this.debounce() <= 0) return;
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this.searched.emit(val);
            this.search.emit(val);
        }, this.debounce());
    }

    // ── Called by zyra-form-field to toggle password ──────────
    togglePassword(): void {
        this.showPassword.update((v) => !v);
    }

    // ── OTP mode ──────────────────────────────────────────────
    otpCharAt(index: number): string {
        return this.otpChars()[index] ?? '';
    }

    onOtpInput(index: number, event: Event): void {
        const el = event.target as HTMLInputElement;
        const raw = el.value;

        // SMS/autofill can drop more than one character into a single box.
        if (raw.length > 1) {
            this._fillOtp(index, raw);
            el.value = this.otpCharAt(index);
            return;
        }

        const char = raw.slice(-1);
        if (char && !this._isValidOtpChar(char)) {
            el.value = this.otpCharAt(index);
            return;
        }

        this._setOtpCharAt(index, char);

        if (char && index < (this.otpLength() ?? 0) - 1) {
            this._focusOtpBox(index + 1);
        }
    }

    onOtpKeydown(index: number, event: KeyboardEvent): void {
        if (event.key === 'Backspace') {
            if (!this.otpCharAt(index) && index > 0) {
                event.preventDefault();
                this._setOtpCharAt(index - 1, '');
                this._focusOtpBox(index - 1);
            }
            return;
        }

        if (event.key === 'ArrowLeft' && index > 0) {
            event.preventDefault();
            this._focusOtpBox(index - 1);
        } else if (event.key === 'ArrowRight' && index < (this.otpLength() ?? 0) - 1) {
            event.preventDefault();
            this._focusOtpBox(index + 1);
        }
    }

    onOtpPaste(index: number, event: ClipboardEvent): void {
        event.preventDefault();
        const text = event.clipboardData?.getData('text') ?? '';
        this._fillOtp(index, text);
    }

    private _isValidOtpChar(char: string): boolean {
        return this.otpType() === 'numeric' ? /^[0-9]$/.test(char) : /^[a-zA-Z0-9]$/.test(char);
    }

    private _setOtpCharAt(index: number, char: string): void {
        const next = [...this.otpChars()];
        next[index] = char;
        this.otpChars.set(next);
        this._commitOtp(next);
    }

    private _fillOtp(startIndex: number, text: string): void {
        const length = this.otpLength() ?? 0;
        const chars = text.split('').filter((c) => this._isValidOtpChar(c));
        if (!chars.length) return;

        const next = [...this.otpChars()];
        for (let i = 0; i < chars.length && startIndex + i < length; i++) {
            next[startIndex + i] = chars[i];
        }
        this.otpChars.set(next);
        this._commitOtp(next);
        this._focusOtpBox(Math.min(startIndex + chars.length, length - 1));
    }

    private _commitOtp(chars: string[]): void {
        const val = chars.join('');
        this.innerValue.set(val);
        this._onChange(val);
        this.valueChange.emit(val);
        if (chars.length === (this.otpLength() ?? 0) && chars.every((c) => c !== '')) {
            this.complete.emit(val);
        }
    }

    private _focusOtpBox(index: number): void {
        const boxes = this._otpBoxes();
        if (!boxes.length) return;
        const target = boxes[Math.max(0, Math.min(index, boxes.length - 1))];
        target.nativeElement.focus();
        target.nativeElement.select();
    }
}

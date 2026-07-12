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
    OnInit,
    output,
    signal,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'auto';

let textareaIdCounter = 0;

@Component({
    selector: 'zyra-textarea',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraTextarea),
            multi: true,
        },
    ],
    templateUrl: './zyra-textarea.html',
    styleUrl: './zyra-textarea.scss',
})
export class ZyraTextarea implements ControlValueAccessor, OnInit {
    // ── Inputs ────────────────────────────────────────────────
    size = input<TextareaSize>('md');
    placeholder = input<string>('');
    rows = input<number>(3);
    readonly = input(false, { transform: booleanAttribute });
    id = input<string>('');
    maxlength = input<number | null>(null);
    resize = input<TextareaResize>('vertical');

    // ── Outputs ───────────────────────────────────────────────
    valueChange = output<string>();
    focused = output<void>();
    blurred = output<void>();

    // ── Internal state ────────────────────────────────────────
    innerValue = signal('');
    isFocused = signal(false);
    isTouched = signal(false);
    isDisabled = signal(false);

    // ── Unique ID ─────────────────────────────────────────────
    readonly textareaId = `zyra-textarea-${++textareaIdCounter}`;
    readonly resolvedId = computed(() => this.id() || this.textareaId);

    @ViewChild('textareaEl') private _textareaEl?: ElementRef<HTMLTextAreaElement>;

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: string) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    private _injector = inject(Injector);
    private _ngControl: NgControl | null = null;

    ngOnInit(): void {
        this._ngControl = this._injector.get(NgControl, null, { self: true, optional: true });
    }

    get ngControl(): NgControl | null {
        return this._ngControl;
    }

    writeValue(val: string): void {
        this.innerValue.set(val ?? '');
    }
    registerOnChange(fn: (v: string) => void): void {
        this._onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }
    setDisabledState(disabled: boolean): void {
        this.isDisabled.set(disabled);
    }

    // ── Event handlers ────────────────────────────────────────
    onModelChange(val: string): void {
        this.innerValue.set(val);
        this._onChange(val);
        this.valueChange.emit(val);
        if (this.resize() === 'auto') this._autoResize();
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

    clear(): void {
        this.innerValue.set('');
        this._onChange('');
        this.valueChange.emit('');
    }

    private _autoResize(): void {
        const el = this._textareaEl?.nativeElement;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }
}

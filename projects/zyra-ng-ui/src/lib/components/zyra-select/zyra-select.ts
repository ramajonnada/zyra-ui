import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    Injector,
    input,
    OnInit,
    output,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { zyraIcons } from '../../shared/fontawesome-icons';
import { ZyraOption, type SelectValue } from './zyra-option';
import { ZYRA_SELECT, type ZyraSelectRef } from './zyra-select-token';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectAppearance = 'outline' | 'filled' | 'underline';

let selectIdCounter = 0;

@Component({
    selector: 'zyra-select',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraSelect),
            multi: true,
        },
        {
            provide: ZYRA_SELECT,
            useExisting: forwardRef(() => ZyraSelect),
        },
    ],
    templateUrl: './zyra-select.html',
    styleUrl: './zyra-select.scss',
})
export class ZyraSelect implements ControlValueAccessor, ZyraSelectRef, OnInit, AfterContentInit {
    // ── Inputs ────────────────────────────────────────────────
    placeholder = input<string>('Select an option');
    size = input<SelectSize>('md');
    appearance = input<SelectAppearance>('outline');
    id = input<string>('');

    // ── Outputs ───────────────────────────────────────────────
    valueChange = output<SelectValue>();
    opened = output<void>();
    closed = output<void>();

    // ── Internal state ────────────────────────────────────────
    readonly isOpen = signal(false);
    readonly innerValue = signal<SelectValue>(null);
    readonly isFocused = signal(false);
    readonly isTouched = signal(false);
    readonly isDisabled = signal(false);
    readonly activeIndex = signal(-1);

    // ── Unique IDs ────────────────────────────────────────────
    readonly selectId = `zyr-select-${++selectIdCounter}`;
    readonly listboxId = `zyr-select-listbox-${selectIdCounter}`;
    readonly resolvedId = computed(() => this.id() || this.selectId);

    // ── Content children ──────────────────────────────────────
    readonly _options = contentChildren(ZyraOption);

    // ── Computed ──────────────────────────────────────────────
    readonly selectedOption = computed(() =>
        this._options().find(o => o.value() === this.innerValue()) ?? null
    );

    readonly selectedLabel = computed(() =>
        this.selectedOption()?.getLabel() ?? ''
    );

    readonly activeOptionId = computed(() => {
        const idx = this.activeIndex();
        const opts = this._options();
        return idx >= 0 && idx < opts.length ? opts[idx].optionId : undefined;
    });

    readonly wrapClass = computed(() => {
        const parts = [
            'zyr-select',
            `zyr-select--${this.appearance()}`,
            `zyr-select--${this.size()}`,
        ];
        if (this.isOpen()) parts.push('zyr-select--open');
        if (this.isFocused()) parts.push('zyr-select--focused');
        if (this.isDisabled()) parts.push('zyr-select--disabled');
        return parts.join(' ');
    });

    readonly icons = zyraIcons;

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: SelectValue) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _injector = inject(Injector);
    private _ngControl: NgControl | null = null;

    ngOnInit(): void {
        this._ngControl = this._injector.get(NgControl, null, {
            self: true,
            optional: true,
        });
    }

    ngAfterContentInit(): void {
        this._syncOptions();
    }

    get ngControl(): NgControl | null {
        return this._ngControl;
    }

    // ── CVA ───────────────────────────────────────────────────
    writeValue(val: SelectValue): void {
        this.innerValue.set(val ?? null);
        this._syncOptions();
    }

    registerOnChange(fn: (val: SelectValue) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    // ── ZyraSelectRef ─────────────────────────────────────────
    selectOption(option: ZyraOption): void {
        if (option.disabled()) return;
        this.innerValue.set(option.value());
        this._onChange(option.value());
        this.valueChange.emit(option.value());
        this._syncOptions();
        this.close();
    }

    // ── Open / close ──────────────────────────────────────────
    toggle(): void {
        if (this.isDisabled()) return;
        this.isOpen() ? this.close() : this.open();
    }

    open(): void {
        if (this.isDisabled() || this.isOpen()) return;
        this.isOpen.set(true);
        const selectedIdx = this._options().findIndex(o => o.value() === this.innerValue());
        this.activeIndex.set(selectedIdx >= 0 ? selectedIdx : 0);
        this._syncOptions();
        this.opened.emit();
    }

    close(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
        this.activeIndex.set(-1);
        this._syncOptions();
        this.closed.emit();
    }

    // ── Focus / blur ──────────────────────────────────────────
    onFocus(): void {
        this.isFocused.set(true);
    }

    onBlur(): void {
        this.isFocused.set(false);
        this.isTouched.set(true);
        this._onTouched();
        if (this.isOpen()) this.close();
    }

    // ── Keyboard navigation ───────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!this.isOpen()) this.open();
                else this._moveActive(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (!this.isOpen()) this.open();
                else this._moveActive(-1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (!this.isOpen()) {
                    this.open();
                } else {
                    const idx = this.activeIndex();
                    const opts = this._options();
                    if (idx >= 0 && idx < opts.length) {
                        this.selectOption(opts[idx]);
                    }
                }
                break;
            case 'Escape':
                event.preventDefault();
                if (this.isOpen()) this.close();
                break;
            case 'Tab':
                if (this.isOpen()) this.close();
                break;
        }
    }

    // ── Click outside ─────────────────────────────────────────
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.isOpen()) return;
        if (!this._el.nativeElement.contains(event.target as Node)) {
            this.close();
        }
    }

    // ── Private helpers ───────────────────────────────────────
    private _moveActive(delta: number): void {
        const opts = this._options();
        if (opts.length === 0) return;

        let idx = this.activeIndex();
        if (idx === -1) idx = delta > 0 ? -1 : opts.length;

        let attempts = 0;
        do {
            idx = (idx + delta + opts.length) % opts.length;
            attempts++;
        } while (opts[idx]?.disabled() && attempts < opts.length);

        if (!opts[idx]?.disabled()) {
            this.activeIndex.set(idx);
            this._syncOptions();
            document.getElementById(opts[idx].optionId)?.scrollIntoView({ block: 'nearest' });
        }
    }

    private _syncOptions(): void {
        const value = this.innerValue();
        const activeIdx = this.activeIndex();
        this._options().forEach((opt, idx) => {
            opt.selected.set(opt.value() === value);
            opt.active.set(idx === activeIdx);
        });
    }
}

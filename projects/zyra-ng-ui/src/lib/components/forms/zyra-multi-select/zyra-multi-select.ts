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
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { chevronDown } from '../../../shared/zyra-icons';
import { ZyraChip } from '../../actions/zyra-chip/zyra-chip';
import { ZyraOption, type SelectValue } from '../zyra-select/zyra-option';
import { ZYRA_SELECT, type ZyraSelectRef } from '../zyra-select/zyra-select-token';

export type MultiSelectSize = 'sm' | 'md' | 'lg';
export type MultiSelectAppearance = 'outline' | 'filled' | 'underline';

let multiSelectIdCounter = 0;

@Component({
    selector: 'zyra-multi-select',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent, ZyraChip],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraMultiSelect),
            multi: true,
        },
        {
            provide: ZYRA_SELECT,
            useExisting: forwardRef(() => ZyraMultiSelect),
        },
    ],
    templateUrl: './zyra-multi-select.html',
    styleUrl: './zyra-multi-select.scss',
})
export class ZyraMultiSelect
    implements ControlValueAccessor, ZyraSelectRef, OnInit, AfterContentInit
{
    // ── Inputs ────────────────────────────────────────────────
    placeholder = input<string>('Select options');
    size = input<MultiSelectSize>('md');
    appearance = input<MultiSelectAppearance>('outline');
    id = input<string>('');
    /** Maximum number of chips shown in the trigger before collapsing into "+N more". */
    maxChips = input<number>(3);

    // ── Outputs ───────────────────────────────────────────────
    valueChange = output<SelectValue[]>();
    opened = output<void>();
    closed = output<void>();

    // ── Internal state ────────────────────────────────────────
    readonly isOpen = signal(false);
    readonly innerValue = signal<SelectValue[]>([]);
    readonly isFocused = signal(false);
    readonly isTouched = signal(false);
    readonly isDisabled = signal(false);
    readonly activeIndex = signal(-1);

    // ── Unique IDs ────────────────────────────────────────────
    readonly selectId = `zyr-multi-select-${++multiSelectIdCounter}`;
    readonly listboxId = `zyr-multi-select-listbox-${multiSelectIdCounter}`;
    readonly resolvedId = computed(() => this.id() || this.selectId);

    // ── Content children ──────────────────────────────────────
    readonly _options = contentChildren(ZyraOption);

    // ── Computed ──────────────────────────────────────────────
    readonly selectedOptions = computed(() => {
        const values = this.innerValue();
        const opts = this._options();
        return opts.filter((o) => values.includes(o.value()));
    });

    readonly visibleChips = computed(() => this.selectedOptions().slice(0, this.maxChips()));
    readonly overflowCount = computed(() =>
        Math.max(0, this.selectedOptions().length - this.maxChips()),
    );

    readonly activeOptionId = computed(() => {
        const idx = this.activeIndex();
        const opts = this._options();
        return idx >= 0 && idx < opts.length ? opts[idx].optionId : undefined;
    });

    readonly wrapClass = computed(() => {
        const parts = [
            'zyr-multi-select',
            `zyr-multi-select--${this.appearance()}`,
            `zyr-multi-select--${this.size()}`,
        ];
        if (this.isOpen()) parts.push('zyr-multi-select--open');
        if (this.isFocused()) parts.push('zyr-multi-select--focused');
        if (this.isDisabled()) parts.push('zyr-multi-select--disabled');
        return parts.join(' ');
    });

    readonly icons = { chevronDown };

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: SelectValue[]) => void = () => undefined;
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
    writeValue(val: SelectValue[]): void {
        this.innerValue.set(Array.isArray(val) ? val : []);
        this._syncOptions();
    }

    registerOnChange(fn: (val: SelectValue[]) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    // ── ZyraSelectRef — toggles instead of replacing ───────────
    selectOption(option: ZyraOption): void {
        if (option.disabled()) return;
        const value = option.value();
        const current = this.innerValue();
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        this.innerValue.set(next);
        this._onChange(next);
        this.valueChange.emit(next);
        this._syncOptions();
    }

    removeValue(value: SelectValue): void {
        if (this.isDisabled()) return;
        const next = this.innerValue().filter((v) => v !== value);
        this.innerValue.set(next);
        this._onChange(next);
        this.valueChange.emit(next);
        this._syncOptions();
    }

    // ── Open / close ──────────────────────────────────────────
    toggle(): void {
        if (this.isDisabled()) return;
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    open(): void {
        if (this.isDisabled() || this.isOpen()) return;
        this.isOpen.set(true);
        this.activeIndex.set(0);
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
        const values = this.innerValue();
        const activeIdx = this.activeIndex();
        this._options().forEach((opt, idx) => {
            opt.selected.set(values.includes(opt.value()));
            opt.active.set(idx === activeIdx);
        });
    }
}

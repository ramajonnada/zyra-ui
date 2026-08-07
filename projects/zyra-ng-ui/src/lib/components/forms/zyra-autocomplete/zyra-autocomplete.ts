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
    PLATFORM_ID,
    signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { ZyraOption, type SelectValue } from '../zyra-select/zyra-option';
import { ZYRA_SELECT, type ZyraSelectRef } from '../zyra-select/zyra-select-token';
import type { ZyraSize } from '../../../shared/zyra-size';

export type AutocompleteSize = ZyraSize;
export type AutocompleteAppearance = 'outline' | 'filled' | 'underline';

let autocompleteIdCounter = 0;

@Component({
    selector: 'zyra-autocomplete',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraAutocomplete),
            multi: true,
        },
        {
            provide: ZYRA_SELECT,
            useExisting: forwardRef(() => ZyraAutocomplete),
        },
    ],
    templateUrl: './zyra-autocomplete.html',
    styleUrl: './zyra-autocomplete.scss',
})
export class ZyraAutocomplete
    implements ControlValueAccessor, ZyraSelectRef, OnInit, AfterContentInit
{
    // ── Inputs ────────────────────────────────────────────────
    placeholder = input<string>('Search…');
    size = input<AutocompleteSize>('md');
    appearance = input<AutocompleteAppearance>('outline');
    id = input<string>('');
    /** Shown in the panel when the query matches no option. */
    noResultsLabel = input<string>('No results');

    // ── Outputs ───────────────────────────────────────────────
    valueChange = output<SelectValue>();
    queryChange = output<string>();
    opened = output<void>();
    closed = output<void>();

    // ── Internal state ────────────────────────────────────────
    readonly isOpen = signal(false);
    readonly query = signal('');
    readonly innerValue = signal<SelectValue>(null);
    readonly isFocused = signal(false);
    readonly isTouched = signal(false);
    readonly isDisabled = signal(false);
    readonly activeIndex = signal(-1);

    // ── Unique IDs ────────────────────────────────────────────
    readonly autocompleteId = `zyr-autocomplete-${++autocompleteIdCounter}`;
    readonly listboxId = `zyr-autocomplete-listbox-${autocompleteIdCounter}`;
    readonly resolvedId = computed(() => this.id() || this.autocompleteId);

    // ── Content children ──────────────────────────────────────
    readonly _options = contentChildren(ZyraOption);

    // ── Computed ──────────────────────────────────────────────
    readonly selectedOption = computed(
        () => this._options().find((o) => o.value() === this.innerValue()) ?? null,
    );

    readonly filteredOptions = computed(() => {
        const q = this.query().trim().toLowerCase();
        if (!q) return this._options();
        return this._options().filter((o) => o.getLabel().toLowerCase().includes(q));
    });

    readonly hasNoResults = computed(
        () => this.isOpen() && this._options().length > 0 && this.filteredOptions().length === 0,
    );

    readonly activeOptionId = computed(() => {
        const idx = this.activeIndex();
        const opts = this.filteredOptions();
        return idx >= 0 && idx < opts.length ? opts[idx].optionId : undefined;
    });

    readonly wrapClass = computed(() => {
        const parts = [
            'zyr-autocomplete',
            `zyr-autocomplete--${this.appearance()}`,
            `zyr-autocomplete--${this.size()}`,
        ];
        if (this.isOpen()) parts.push('zyr-autocomplete--open');
        if (this.isFocused()) parts.push('zyr-autocomplete--focused');
        if (this.isDisabled()) parts.push('zyr-autocomplete--disabled');
        return parts.join(' ');
    });

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: SelectValue) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _injector = inject(Injector);
    private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private _ngControl: NgControl | null = null;

    ngOnInit(): void {
        this._ngControl = this._injector.get(NgControl, null, {
            self: true,
            optional: true,
        });
    }

    ngAfterContentInit(): void {
        this._syncOptions();
        this._syncVisibility();
    }

    get ngControl(): NgControl | null {
        return this._ngControl;
    }

    // ── CVA ───────────────────────────────────────────────────
    writeValue(val: SelectValue): void {
        this.innerValue.set(val ?? null);
        this.query.set(this.selectedOption()?.getLabel() ?? '');
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
        this.query.set(option.getLabel());
        this._onChange(option.value());
        this.valueChange.emit(option.value());
        this._syncOptions();
        this.close();
    }

    // ── Input handling ────────────────────────────────────────
    onInput(value: string): void {
        this.query.set(value);
        this.queryChange.emit(value);
        this.activeIndex.set(this.filteredOptions().length > 0 ? 0 : -1);
        this._syncOptions();
        this._syncVisibility();
        if (!this.isOpen()) this.open();
    }

    // ── Open / close ──────────────────────────────────────────
    open(): void {
        if (this.isDisabled() || this.isOpen()) return;
        this.isOpen.set(true);
        this.activeIndex.set(this.filteredOptions().length > 0 ? 0 : -1);
        this._syncOptions();
        this._syncVisibility();
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
        this.open();
    }

    onBlur(): void {
        this.isFocused.set(false);
        this.isTouched.set(true);
        this._onTouched();
        // Revert to the committed selection's label if the query doesn't match it.
        this.query.set(this.selectedOption()?.getLabel() ?? '');
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
            case 'Enter': {
                event.preventDefault();
                const idx = this.activeIndex();
                const opts = this.filteredOptions();
                if (idx >= 0 && idx < opts.length) {
                    this.selectOption(opts[idx]);
                }
                break;
            }
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
        const opts = this.filteredOptions();
        if (opts.length === 0) return;

        let idx = this.activeIndex();
        if (idx === -1) idx = delta > 0 ? -1 : opts.length;
        idx = (idx + delta + opts.length) % opts.length;

        this.activeIndex.set(idx);
        this._syncOptions();
        if (this._isBrowser) {
            document.getElementById(opts[idx].optionId)?.scrollIntoView({ block: 'nearest' });
        }
    }

    private _syncOptions(): void {
        const value = this.innerValue();
        const activeOpt = this.filteredOptions()[this.activeIndex()];
        this._options().forEach((opt) => {
            opt.selected.set(opt.value() === value);
            opt.active.set(opt === activeOpt);
        });
    }

    /** Hides options that don't match the current query — reuses `zyra-option`'s
     * DOM id rather than forking it with a new "hidden" input. */
    private _syncVisibility(): void {
        if (!this._isBrowser) return;
        const visible = new Set(this.filteredOptions().map((o) => o.optionId));
        this._options().forEach((opt) => {
            const el = document.getElementById(opt.optionId);
            if (el) el.hidden = !visible.has(opt.optionId);
        });
    }
}

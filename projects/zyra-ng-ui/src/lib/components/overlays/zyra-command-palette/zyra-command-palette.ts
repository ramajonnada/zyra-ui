import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Injector,
    OnDestroy,
    ViewChild,
    afterNextRender,
    computed,
    effect,
    inject,
    input,
    model,
    output,
    signal,
} from '@angular/core';
import type { ZyraIconData } from '../../../internal/zyra-icon/zyra-icon';
import { ZyraIcon } from '../../../internal/zyra-icon/zyra-icon';
import { lockBodyScroll, unlockBodyScroll } from '../../../internal/body-scroll-lock';
import { search } from '../../../shared/zyra-icons';

export interface CommandPaletteItem {
    id: string;
    label: string;
    description?: string;
    icon?: ZyraIconData;
    shortcut?: string;
    group?: string;
    disabled?: boolean;
}

interface FlatItem {
    item: CommandPaletteItem;
    flatIndex: number;
}

interface RenderGroup {
    name: string | null;
    items: FlatItem[];
}

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

function fuzzyMatch(query: string, text: string): boolean {
    if (!query) return true;
    let qi = 0;
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    for (let i = 0; i < t.length && qi < q.length; i++) {
        if (t[i] === q[qi]) qi++;
    }
    return qi === q.length;
}

@Component({
    selector: 'zyra-command-palette',
    standalone: true,
    imports: [ZyraIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-command-palette.html',
    styleUrl: './zyra-command-palette.scss',
})
export class ZyraCommandPalette implements OnDestroy {
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild('panel') panel!: ElementRef<HTMLElement>;

    // ── Inputs ────────────────────────────────────────────────
    items = input<CommandPaletteItem[]>([]);
    placeholder = input<string>('Search commands…');
    emptyText = input<string>('No matching commands');
    /** Disables the global Ctrl/Cmd+K listener — useful when multiple palettes exist, or the host app wants to own the shortcut. */
    globalShortcut = input<boolean>(true);

    // ── Two-way state ─────────────────────────────────────────
    open = model<boolean>(false);

    // ── Outputs ───────────────────────────────────────────────
    opened = output<void>();
    closed = output<void>();
    selected = output<CommandPaletteItem>();

    // ── Icons ─────────────────────────────────────────────────
    readonly searchIcon = search;

    // ── Internal state ────────────────────────────────────────
    query = signal('');
    activeIndex = signal(0);

    private readonly _injector = inject(Injector);
    private readonly _doc = inject(DOCUMENT);
    private _hasScrollLock = false;

    // ── Computed ──────────────────────────────────────────────
    private readonly filteredFlat = computed<FlatItem[]>(() => {
        const q = this.query().trim();
        const flat: FlatItem[] = [];
        for (const item of this.items()) {
            if (fuzzyMatch(q, item.label) || (item.description && fuzzyMatch(q, item.description))) {
                flat.push({ item, flatIndex: flat.length });
            }
        }
        return flat;
    });

    readonly groups = computed<RenderGroup[]>(() => {
        const groups: RenderGroup[] = [];
        const byName = new Map<string | null, RenderGroup>();
        for (const flat of this.filteredFlat()) {
            const name = flat.item.group ?? null;
            let group = byName.get(name);
            if (!group) {
                group = { name, items: [] };
                byName.set(name, group);
                groups.push(group);
            }
            group.items.push(flat);
        }
        return groups;
    });

    readonly resultCount = computed(() => this.filteredFlat().length);

    constructor() {
        effect(() => {
            if (this.open()) {
                if (!this._hasScrollLock) {
                    lockBodyScroll(this._doc);
                    this._hasScrollLock = true;
                }
                afterNextRender(() => this.searchInput?.nativeElement?.focus(), {
                    injector: this._injector,
                });
            } else if (this._hasScrollLock) {
                unlockBodyScroll(this._doc);
                this._hasScrollLock = false;
            }
        });
    }

    ngOnDestroy(): void {
        if (this._hasScrollLock) {
            unlockBodyScroll(this._doc);
            this._hasScrollLock = false;
        }
    }

    // ── Open / close ──────────────────────────────────────────
    show(): void {
        if (this.open()) return;
        this.query.set('');
        this.activeIndex.set(0);
        this.open.set(true);
        this.opened.emit();
    }

    close(): void {
        if (!this.open()) return;
        this.open.set(false);
        this.closed.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.close();
    }

    onQueryChange(value: string): void {
        this.query.set(value);
        this.activeIndex.set(0);
    }

    isActive(flatIndex: number): boolean {
        return this.activeIndex() === flatIndex;
    }

    selectItem(item: CommandPaletteItem): void {
        if (item.disabled) return;
        this.selected.emit(item);
        this.close();
    }

    // ── Keyboard ──────────────────────────────────────────────
    @HostListener('document:keydown', ['$event'])
    onGlobalKeydown(event: KeyboardEvent): void {
        if (!this.globalShortcut()) return;
        const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
        if (isShortcut) {
            event.preventDefault();
            if (this.open()) this.close();
            else this.show();
        }
    }

    onKeydown(event: KeyboardEvent): void {
        const flat = this.filteredFlat();
        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                if (flat.length === 0) break;
                this.activeIndex.set(Math.min(this.activeIndex() + 1, flat.length - 1));
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                if (flat.length === 0) break;
                this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
                break;
            }
            case 'Enter': {
                event.preventDefault();
                const active = flat[this.activeIndex()];
                if (active) this.selectItem(active.item);
                break;
            }
            case 'Escape': {
                event.preventDefault();
                this.close();
                break;
            }
        }
    }

    // ── Focus trap ────────────────────────────────────────────
    @HostListener('keydown', ['$event'])
    onTab(event: KeyboardEvent): void {
        if (!this.open() || event.key !== 'Tab') return;
        const panelEl = this.panel?.nativeElement;
        if (!panelEl) return;

        const focusable = Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = this._doc.activeElement as HTMLElement;

        if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    }
}

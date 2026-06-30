import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    input,
    output,
    PLATFORM_ID,
    signal,
    viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ZyraTab } from './zyra-tab';
import { ZYRA_TABS, ZyraTabsRef } from './zyra-tabs-token';

export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsVariant = 'underline' | 'pill' | 'filled' | 'outlined';
export type TabsOrientation = 'horizontal' | 'vertical';

@Component({
    selector: 'zyra-tabs',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: ZYRA_TABS, useExisting: forwardRef(() => ZyraTabs) }],
    host: {
        '[class]':
            '"zyr-tabs zyr-tabs--" + size() + " zyr-tabs--" + variant() + (orientation() === "vertical" ? " zyr-tabs--vertical" : "")',
    },
    templateUrl: './zyra-tabs.html',
    styleUrl: './zyra-tabs.scss',
})
export class ZyraTabs implements ZyraTabsRef, AfterContentInit, AfterViewInit {
    // ── Inputs ────────────────────────────────────────────────
    size = input<TabsSize>('md');
    variant = input<TabsVariant>('underline');
    orientation = input<TabsOrientation>('horizontal');

    // ── Outputs ───────────────────────────────────────────────
    tabChange = output<string>();
    tabClose = output<string>();

    // ── State ─────────────────────────────────────────────────
    readonly activeTabId = signal<string | null>(null);
    readonly _tabs = contentChildren(ZyraTab);
    readonly _visibleTabs = computed(() => this._tabs().filter((t) => !t.closed()));

    private readonly _listRef = viewChild<ElementRef<HTMLElement>>('tabList');
    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    ngAfterContentInit(): void {
        const first = this._visibleTabs().find((t) => !t.disabled());
        if (first) this.activateTab(first);
    }

    ngAfterViewInit(): void {
        if (this.variant() === 'underline' && this._isBrowser) {
            const active = this._visibleTabs().find((t) => t.active());
            if (active) requestAnimationFrame(() => this._syncIndicator(active));
        }
    }

    // ── ZyraTabsRef ───────────────────────────────────────────
    activateTab(tab: ZyraTab): void {
        if (tab.disabled() || tab.closed()) return;
        const visible = this._visibleTabs();
        const oldIdx = visible.findIndex((t) => t.active());
        const newIdx = visible.indexOf(tab);
        const dir =
            oldIdx !== -1 && newIdx !== oldIdx ? (newIdx > oldIdx ? 'right' : 'left') : null;

        visible.forEach((t) => t.active.set(false));
        tab.active.set(true);
        tab._loaded.set(true);
        tab._slideDir.set(dir);
        this.activeTabId.set(tab._uid);
        this.tabChange.emit(tab.tabId() || tab._uid);

        // Sync sliding indicator for underline variant (browser only)
        if (this.variant() === 'underline' && this._isBrowser) {
            requestAnimationFrame(() => this._syncIndicator(tab));
        }
    }

    private _syncIndicator(tab: ZyraTab): void {
        const list = this._listRef()?.nativeElement;
        const trigger = this._el.nativeElement.querySelector(
            `#${tab.triggerId}`,
        ) as HTMLElement | null;
        if (!list || !trigger) return;
        list.style.setProperty('--ind-left', trigger.offsetLeft + 'px');
        list.style.setProperty('--ind-width', trigger.offsetWidth + 'px');
    }

    closeTab(tab: ZyraTab): void {
        if (tab.active()) {
            const visible = this._visibleTabs();
            const idx = visible.indexOf(tab);
            const next = visible[idx + 1] ?? visible[idx - 1];
            if (next) this.activateTab(next);
        }
        tab.closed.set(true);
        this.tabClose.emit(tab.tabId() || tab._uid);
    }

    // ── Keyboard navigation ───────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const isVertical = this.orientation() === 'vertical';
        const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
        const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

        if (event.key === 'Delete' || event.key === 'Backspace') {
            const visible = this._visibleTabs();
            const active = visible.find((t) => t.active());
            if (active?.closeable() && visible.length > 1) {
                event.preventDefault();
                this.closeTab(active);
            }
            return;
        }

        if (event.key !== nextKey && event.key !== prevKey) return;
        const tabs = this._visibleTabs().filter((t) => !t.disabled());
        if (!tabs.length) return;

        const currentIdx = tabs.findIndex((t) => t.active());
        if (currentIdx === -1) return;

        event.preventDefault();
        const delta = event.key === nextKey ? 1 : -1;
        const next = (currentIdx + delta + tabs.length) % tabs.length;
        this.activateTab(tabs[next]);
        document.getElementById(tabs[next].triggerId)?.focus();
    }
}

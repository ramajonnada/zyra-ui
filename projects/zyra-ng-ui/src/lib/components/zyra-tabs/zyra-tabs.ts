import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    forwardRef,
    HostListener,
    input,
    output,
    signal,
} from '@angular/core';
import { ZyraTab } from './zyra-tab';
import { ZYRA_TABS, ZyraTabsRef } from './zyra-tabs-token';

export type TabsSize = 'sm' | 'md';

@Component({
    selector: 'zyra-tabs',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ZYRA_TABS,
            useExisting: forwardRef(() => ZyraTabs),
        },
    ],
    host: {
        '[class]': '"zyr-tabs zyr-tabs--" + size() + " zyr-tabs--" + variant()',
    },
    templateUrl: './zyra-tabs.html',
    styleUrl:    './zyra-tabs.scss',
})
export class ZyraTabs implements ZyraTabsRef, AfterContentInit {
    // ── Inputs ────────────────────────────────────────────────
    size    = input<TabsSize>('md');
    variant = input<'underline' | 'pill'>('underline');

    // ── Outputs ───────────────────────────────────────────────
    tabChange = output<string>();

    // ── State ─────────────────────────────────────────────────
    readonly activeTabId = signal<string | null>(null);

    readonly _tabs = contentChildren(ZyraTab);

    ngAfterContentInit(): void {
        const first = this._tabs().find(t => !t.disabled());
        if (first) this.activateTab(first);
    }

    // ── ZyraTabsRef ───────────────────────────────────────────
    activateTab(tab: ZyraTab): void {
        if (tab.disabled()) return;
        const tabs = this._tabs();
        const oldIdx = tabs.findIndex(t => t.active());
        const newIdx = tabs.indexOf(tab);
        const dir = (oldIdx !== -1 && newIdx !== oldIdx)
            ? (newIdx > oldIdx ? 'right' : 'left')
            : null;

        tabs.forEach(t => t.active.set(false));
        tab.active.set(true);
        tab._loaded.set(true);
        tab._slideDir.set(dir);
        this.activeTabId.set(tab._uid);
        this.tabChange.emit(tab.tabId() || tab._uid);
    }

    // ── Keyboard navigation ───────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        const tabs = this._tabs().filter(t => !t.disabled());
        if (!tabs.length) return;

        const currentIdx = tabs.findIndex(t => t.active());
        if (currentIdx === -1) return;

        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const next  = (currentIdx + delta + tabs.length) % tabs.length;
        this.activateTab(tabs[next]);
        document.getElementById(tabs[next].triggerId)?.focus();
    }
}

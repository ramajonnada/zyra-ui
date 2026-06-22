import { booleanAttribute, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { SlideDir } from './zyra-tabs-token';

let tabCounter = 0;

@Component({
    selector: 'zyra-tab',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-tab.html',
    styleUrl: './zyra-tab.scss',
})
export class ZyraTab {
    // ── Inputs ────────────────────────────────────────────────
    label    = input.required<string>();
    tabId    = input<string>('');
    disabled = input(false, { transform: booleanAttribute });

    // ── Unique IDs for ARIA ───────────────────────────────────
    readonly _uid        = `zyr-tab-${++tabCounter}`;
    readonly triggerId   = `zyr-tab-trigger-${tabCounter}`;
    readonly panelId     = `zyr-tab-panel-${tabCounter}`;

    // ── State set by ZyraTabs ─────────────────────────────────
    readonly active    = signal(false);
    readonly _loaded   = signal(false);
    readonly _slideDir = signal<SlideDir>(null);

    _onAnimEnd(): void { this._slideDir.set(null); }
}

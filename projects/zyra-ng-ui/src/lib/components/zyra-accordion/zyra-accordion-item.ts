import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
} from '@angular/core';
import { ZyraAccordion } from './zyra-accordion';

let accordionItemCounter = 0;

@Component({
    selector: 'zyra-accordion-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-accordion-item.html',
    styleUrl: './zyra-accordion-item.scss',
})
export class ZyraAccordionItem {
    private readonly _accordion = inject(ZyraAccordion, { optional: true });

    // ── Inputs ────────────────────────────────────────────────
    title = input<string>('');
    disabled = input(false, { transform: booleanAttribute });
    open = model<boolean>(false);

    // ── Unique IDs for aria-controls / aria-labelledby ────────
    readonly triggerId = `zyr-accordion-trigger-${++accordionItemCounter}`;
    readonly panelId = `zyr-accordion-panel-${accordionItemCounter}`;

    // ── Computed ──────────────────────────────────────────────
    triggerClass = computed(() => {
        const base = 'zyr-accordion-item__trigger';
        return this.disabled() ? `${base} ${base}--disabled` : base;
    });

    // ── Methods ───────────────────────────────────────────────
    toggle(): void {
        if (this.disabled()) return;
        const next = !this.open();
        this.open.set(next);
        if (next) this._accordion?.onItemOpened(this);
    }

    focus(): void {
        document.getElementById(this.triggerId)?.focus();
    }
}

import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

let accordionItemCounter = 0;

@Component({
    selector: 'zyra-accordion-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-accordion-item.html',
    styleUrl: './zyra-accordion-item.scss',
})
export class ZyraAccordionItem {
    // ── Inputs ────────────────────────────────────────────────
    title = input<string>('');
    disabled = input(false, { transform: booleanAttribute });
    open = model<boolean>(false);

    // ── Unique IDs for aria-controls / aria-labelledby ────────
    readonly triggerId = `zyr-accordion-trigger-${++accordionItemCounter}`;
    readonly panelId   = `zyr-accordion-panel-${accordionItemCounter}`;

    // ── Computed ──────────────────────────────────────────────
    triggerClass = computed(() => {
        const base = 'zyr-accordion-item__trigger';
        return this.disabled() ? `${base} ${base}--disabled` : base;
    });

    // ── Methods ───────────────────────────────────────────────
    toggle(): void {
        if (this.disabled()) return;
        this.open.set(!this.open());
    }

    focus(): void {
        document.getElementById(this.triggerId)?.focus();
    }
}

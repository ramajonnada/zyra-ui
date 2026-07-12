import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    HostListener,
    input,
} from '@angular/core';
import { ZyraAccordionItem } from './zyra-accordion-item';

@Component({
    selector: 'zyra-accordion',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div class="zyr-accordion"><ng-content /></div>`,
    styleUrl: './zyra-accordion.scss',
})
export class ZyraAccordion {
    // ── Inputs ────────────────────────────────────────────────
    allowMultiple = input(false, { transform: booleanAttribute });

    private readonly items = contentChildren(ZyraAccordionItem);

    // ── Called by each item's trigger click via event delegation ─
    onItemOpened(opened: ZyraAccordionItem): void {
        if (this.allowMultiple()) return;
        this.items()
            .filter((item) => item !== opened)
            .forEach((item) => item.open.set(false));
    }

    // ── Arrow key navigation between triggers ─────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

        const items = this.items().filter((item) => !item.disabled());
        if (items.length === 0) return;

        const triggers = items.map((i) => document.getElementById(i.triggerId));
        const activeIndex = triggers.findIndex((t) => t === document.activeElement);
        if (activeIndex === -1) return;

        event.preventDefault();
        const next =
            event.key === 'ArrowDown'
                ? (activeIndex + 1) % items.length
                : (activeIndex - 1 + items.length) % items.length;
        items[next].focus();
    }
}

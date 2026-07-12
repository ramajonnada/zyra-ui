import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ZyraIcon } from '../../../internal/zyra-icon/zyra-icon';
import type { ZyraIconData } from '../../../shared/zyra-icons';

@Component({
    selector: 'a[zyra-sidebar-item]',
    standalone: true,
    imports: [ZyraIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'zyr-sidebar-item',
        '[class.zyr-sidebar-item--active]': 'active()',
        '[class.zyr-sidebar-item--disabled]': 'disabled()',
        '[attr.aria-current]': "active() ? 'page' : null",
        '[attr.aria-disabled]': "disabled() ? 'true' : null",
        '[attr.tabindex]': 'disabled() ? -1 : null',
        '(click)': 'handleClick($event)',
    },
    templateUrl: './zyra-sidebar-item.html',
    styleUrl: './zyra-sidebar-item.scss',
})
export class ZyraSidebarItem {
    // ── Inputs ────────────────────────────────────────────────
    active = input(false, { transform: booleanAttribute });
    disabled = input(false, { transform: booleanAttribute });
    icon = input<ZyraIconData | null>(null);
    badge = input<string | number>('');

    // ── Outputs ───────────────────────────────────────────────
    itemClick = output<MouseEvent>();

    // ── Methods ───────────────────────────────────────────────
    handleClick(event: MouseEvent): void {
        if (this.disabled()) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.itemClick.emit(event);
    }
}

import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ZYRA_DROPDOWN_MENU } from './zyra-dropdown-menu-token';

export type MenuItemVariant = 'default' | 'danger';

@Component({
    selector: 'zyra-menu-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-menu-item.html',
    styleUrl: './zyra-menu-item.scss',
})
export class ZyraMenuItem {
    // ── Inputs ────────────────────────────────────────────────
    disabled = input(false, { transform: booleanAttribute });
    variant = input<MenuItemVariant>('default');

    // ── Outputs ───────────────────────────────────────────────
    itemClick = output<void>();

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => `zyr-menu-item zyr-menu-item--${this.variant()}`);

    private readonly _menu = inject(ZYRA_DROPDOWN_MENU, { optional: true });

    // ── Methods ───────────────────────────────────────────────
    handleClick(): void {
        if (this.disabled()) return;
        this.itemClick.emit();
        this._menu?.closeMenu();
    }
}

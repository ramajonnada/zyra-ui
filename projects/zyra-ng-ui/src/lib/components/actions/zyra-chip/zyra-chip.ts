import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import type { ZyraSize } from '../../../shared/zyra-size';

export type ChipVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
export type ChipSize = ZyraSize;

@Component({
    selector: 'zyra-chip',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-chip.html',
    styleUrl: './zyra-chip.scss',
})
export class ZyraChip {
    // ── Inputs ────────────────────────────────────────────────
    variant = input<ChipVariant>('default');
    size = input<ChipSize>('md');
    dismissible = input(false, { transform: booleanAttribute });
    selectable = input(false, { transform: booleanAttribute });
    selected = model<boolean>(false);
    disabled = input(false, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────
    dismissed = output<void>();

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const classes = ['zyr-chip', `zyr-chip--${this.variant()}`, `zyr-chip--${this.size()}`];
        if (this.selectable()) classes.push('zyr-chip--selectable');
        if (this.selected()) classes.push('zyr-chip--selected');
        if (this.disabled()) classes.push('zyr-chip--disabled');
        return classes.join(' ');
    });

    // ── Methods ───────────────────────────────────────────────
    toggle(): void {
        if (!this.selectable() || this.disabled()) return;
        // model()'s .set() already emits selectedChange automatically —
        // no separate emit() call needed.
        this.selected.set(!this.selected());
    }

    dismiss(event: MouseEvent): void {
        event.stopPropagation();
        if (this.disabled()) return;
        this.dismissed.emit();
    }
}

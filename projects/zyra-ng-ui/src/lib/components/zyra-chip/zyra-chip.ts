import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

export type ChipVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
export type ChipSize = 'sm' | 'md' | 'lg';

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
    dismissible = input<boolean>(false);
    selectable = input<boolean>(false);
    selected = model<boolean>(false);
    disabled = input<boolean>(false);

    // ── Outputs ───────────────────────────────────────────────
    dismissed = output<void>();
    selectedChange = output<boolean>();

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const classes = [
            'zyr-chip',
            `zyr-chip--${this.variant()}`,
            `zyr-chip--${this.size()}`,
        ];
        if (this.selectable()) classes.push('zyr-chip--selectable');
        if (this.selected()) classes.push('zyr-chip--selected');
        if (this.disabled()) classes.push('zyr-chip--disabled');
        return classes.join(' ');
    });

    // ── Methods ───────────────────────────────────────────────
    toggle(): void {
        if (!this.selectable() || this.disabled()) return;
        const next = !this.selected();
        this.selected.set(next);
        this.selectedChange.emit(next);
    }

    dismiss(event: MouseEvent): void {
        event.stopPropagation();
        if (this.disabled()) return;
        this.dismissed.emit();
    }
}

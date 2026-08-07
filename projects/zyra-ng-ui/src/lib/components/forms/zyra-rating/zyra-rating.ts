import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { ZyraSize } from '../../../shared/zyra-size';

export type RatingSize = ZyraSize;

@Component({
    selector: 'zyra-rating',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-rating.html',
    styleUrl: './zyra-rating.scss',
})
export class ZyraRating {
    // ── Inputs ────────────────────────────────────────────────
    value = input<number>(0);
    max = input<number>(5);
    size = input<RatingSize>('md');
    readonly = input(false, { transform: booleanAttribute });
    disabled = input(false, { transform: booleanAttribute });
    ariaLabel = input<string>('Rating');

    // ── Outputs ───────────────────────────────────────────────
    valueChange = output<number>();

    // ── State ─────────────────────────────────────────────────
    hoverValue = signal<number | null>(null);

    // ── Computed ──────────────────────────────────────────────
    stars = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));

    hostClass = computed(() => {
        const parts = ['zyr-rating', `zyr-rating--${this.size()}`];
        if (this.disabled()) parts.push('zyr-rating--disabled');
        if (this.readonly()) parts.push('zyr-rating--readonly');
        return parts.join(' ');
    });

    readonly isInteractive = computed(() => !this.readonly() && !this.disabled());

    isFilled(star: number): boolean {
        const active = this.hoverValue() ?? this.value();
        return star <= active;
    }

    select(star: number): void {
        if (!this.isInteractive()) return;
        this.valueChange.emit(star);
    }

    onHover(star: number): void {
        if (!this.isInteractive()) return;
        this.hoverValue.set(star);
    }

    onLeave(): void {
        if (!this.isInteractive()) return;
        this.hoverValue.set(null);
    }

    onKeydown(event: KeyboardEvent): void {
        if (!this.isInteractive()) return;
        const max = this.max();
        const current = this.value();

        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault();
            this.valueChange.emit(Math.min(max, current + 1));
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault();
            this.valueChange.emit(Math.max(1, current - 1));
        }
    }
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerColor = 'accent' | 'accent-2' | 'white' | 'current';

@Component({
    selector: 'zyra-spinner',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-spinner.html',
    styleUrl: './zyra-spinner.scss',
})
export class ZyraSpinner {
    // ── Inputs ────────────────────────────────────────────────
    size = input<SpinnerSize>('md');
    color = input<SpinnerColor>('accent');
    label = input<string>('Loading…');

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(
        () => `zyr-spinner zyr-spinner--${this.size()} zyr-spinner--${this.color()}`,
    );

    sizeValue = computed(() => {
        const map: Record<SpinnerSize, string> = {
            xs: '12px',
            sm: '16px',
            md: '24px',
            lg: '36px',
        };
        return map[this.size()];
    });
}

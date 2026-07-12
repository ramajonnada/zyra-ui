import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StackDirection = 'row' | 'column';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

@Component({
    selector: 'zyra-stack',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-stack.html',
    styleUrl: './zyra-stack.scss',
})
export class ZyraStack {
    // ── Inputs ────────────────────────────────────────────────
    direction = input<StackDirection>('column');
    gap = input<StackGap>('md');
    align = input<StackAlign>('stretch');
    justify = input<StackJustify>('start');
    wrap = input(false, { transform: booleanAttribute });

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const parts = [
            'zyr-stack',
            `zyr-stack--${this.direction()}`,
            `zyr-stack--gap-${this.gap()}`,
            `zyr-stack--align-${this.align()}`,
            `zyr-stack--justify-${this.justify()}`,
        ];
        if (this.wrap()) parts.push('zyr-stack--wrap');
        return parts.join(' ');
    });
}

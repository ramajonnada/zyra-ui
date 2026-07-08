import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type TimelineItemVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

@Component({
    selector: 'zyra-timeline-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-timeline-item.html',
    styleUrl: './zyra-timeline-item.scss',
})
export class ZyraTimelineItem {
    // ── Inputs ────────────────────────────────────────────────
    title = input<string>('');
    date = input<string>('');
    variant = input<TimelineItemVariant>('default');

    // ── Computed ──────────────────────────────────────────────
    markerClass = computed(() => `zyr-timeline-item__dot zyr-timeline-item__dot--${this.variant()}`);
}

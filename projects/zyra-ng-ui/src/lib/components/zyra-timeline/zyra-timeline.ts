import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TimelineOrientation = 'vertical';

@Component({
    selector: 'zyra-timeline',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div class="zyr-timeline"><ng-content /></div>`,
    styleUrl: './zyra-timeline.scss',
})
export class ZyraTimeline {
    // ── Inputs ────────────────────────────────────────────────
    orientation = input<TimelineOrientation>('vertical');
}

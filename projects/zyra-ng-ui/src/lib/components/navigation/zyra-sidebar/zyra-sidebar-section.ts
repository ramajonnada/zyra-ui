import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let sectionIdCounter = 0;

@Component({
    selector: 'zyra-sidebar-section',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-sidebar-section.html',
    styleUrl: './zyra-sidebar-section.scss',
})
export class ZyraSidebarSection {
    // ── Inputs ────────────────────────────────────────────────
    heading = input<string>('');

    readonly headingId = `zyr-sidebar-section-heading-${++sectionIdCounter}`;
}

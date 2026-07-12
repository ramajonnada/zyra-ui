import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
}

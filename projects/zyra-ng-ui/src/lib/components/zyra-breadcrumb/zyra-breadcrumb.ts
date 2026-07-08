import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'zyra-breadcrumb',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-breadcrumb.html',
    styleUrl: './zyra-breadcrumb.scss',
})
export class ZyraBreadcrumb {
    // ── Inputs ────────────────────────────────────────────────
    ariaLabel = input<string>('Breadcrumb');
}

import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraIcon } from '../../../internal/zyra-icon/zyra-icon';
import { chevronRight } from '../../../shared/zyra-icons';

@Component({
    selector: 'zyra-breadcrumb-item',
    standalone: true,
    imports: [ZyraIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-breadcrumb-item.html',
    styleUrl: './zyra-breadcrumb-item.scss',
})
export class ZyraBreadcrumbItem {
    // ── Inputs ────────────────────────────────────────────────
    href = input<string>('');
    current = input(false, { transform: booleanAttribute });

    // ── Icons ─────────────────────────────────────────────────
    readonly sepIcon = chevronRight;
}

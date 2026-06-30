import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraBadge } from 'zyra-ng-ui';

@Component({
    selector: 'pg-badge-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraBadge],
    template: `
        <zyra-badge [variant]="$any(variant())" [size]="$any(size())" [dot]="dot()">
            {{ label() }}
        </zyra-badge>
    `,
})
export class BadgeRenderer {
    variant = input<string>('success');
    size = input<string>('md');
    dot = input<boolean>(false);
    label = input<string>('Badge');
}

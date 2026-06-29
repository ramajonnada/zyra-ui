import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraButton, ZyraTooltip } from 'zyra-ng-ui';

@Component({
    selector: 'pg-tooltip-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraTooltip, ZyraButton],
    template: `
        <zyra-tooltip
            [text]="tooltipText()"
            [position]="$any(position())"
            [maxWidth]="maxWidth()"
        >
            <zyra-button variant="outline">Hover me</zyra-button>
        </zyra-tooltip>
    `,
})
export class TooltipRenderer {
    position    = input<string>('top');
    maxWidth    = input<string>('200px');
    tooltipText = input<string>('This is a tooltip!');
}

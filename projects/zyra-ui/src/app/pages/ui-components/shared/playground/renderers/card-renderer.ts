import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraCard } from 'zyra-ng-ui';

@Component({
    selector: 'pg-card-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraCard],
    template: `
        <zyra-card
            [variant]="$any(variant())"
            [padding]="$any(padding())"
            [clickable]="clickable()"
            [hasHeader]="hasHeader()"
            [hasFooter]="hasFooter()"
            style="min-width: 280px"
        >
            @if (hasHeader()) {
                <div slot="header">Card Header</div>
            }
            <p style="margin:0; color: var(--zyr-text-muted)">Card body content.</p>
            @if (hasFooter()) {
                <div slot="footer">Card Footer</div>
            }
        </zyra-card>
    `,
})
export class CardRenderer {
    variant   = input<string>('default');
    padding   = input<string>('md');
    clickable = input<boolean>(false);
    hasHeader = input<boolean>(false);
    hasFooter = input<boolean>(false);
}

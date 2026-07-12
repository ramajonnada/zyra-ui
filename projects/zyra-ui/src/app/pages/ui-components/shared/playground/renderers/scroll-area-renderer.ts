import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraScrollArea } from 'zyra-ng-ui';

@Component({
    selector: 'pg-scroll-area-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraScrollArea],
    styles: [
        `
            .pg-scroll-area-renderer__row {
                padding: 10px 14px;
                border-bottom: 1px solid var(--zyra-color-border);
                font-size: 13px;
                color: var(--zyra-color-text-muted);
                white-space: nowrap;
            }
        `,
    ],
    template: `
        <zyra-scroll-area
            maxHeight="220px"
            [orientation]="$any(orientation())"
            [autoHideScrollbar]="autoHideScrollbar()"
            [showScrollShadows]="showScrollShadows()"
            [smoothScroll]="smoothScroll()"
        >
            @for (n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track n) {
                <div class="pg-scroll-area-renderer__row">Row {{ n }} — scrollable content</div>
            }
        </zyra-scroll-area>
    `,
})
export class ScrollAreaRenderer {
    orientation = input<string>('vertical');
    autoHideScrollbar = input<boolean>(false);
    showScrollShadows = input<boolean>(false);
    smoothScroll = input<boolean>(false);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraFlex } from 'zyra-ng-ui';

@Component({
    selector: 'pg-flex-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraFlex],
    styles: [
        `
            .pg-flex-renderer__box {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 56px;
                height: 56px;
                border-radius: 8px;
                background: var(--zyra-color-accent-muted);
                color: var(--zyra-color-accent);
                font-family: var(--zyra-font-mono);
                font-size: 12px;
            }
        `,
    ],
    template: `
        <zyra-flex
            [direction]="$any(direction())"
            [justify]="$any(justify())"
            [align]="$any(align())"
            [gap]="$any(gap())"
            [wrap]="wrap()"
        >
            <div class="pg-flex-renderer__box">1</div>
            <div class="pg-flex-renderer__box">2</div>
            <div class="pg-flex-renderer__box">3</div>
        </zyra-flex>
    `,
})
export class FlexRenderer {
    direction = input<string>('row');
    justify = input<string>('start');
    align = input<string>('stretch');
    gap = input<string>('md');
    wrap = input<boolean>(false);
}

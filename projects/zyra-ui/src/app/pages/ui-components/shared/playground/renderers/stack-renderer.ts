import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraStack } from 'zyra-ng-ui';

@Component({
    selector: 'pg-stack-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraStack],
    styles: [
        `
            .pg-stack-renderer__box {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 48px;
                height: 48px;
                border-radius: 8px;
                background: var(--zyra-color-accent-muted);
                color: var(--zyra-color-accent);
                font-family: var(--zyra-font-mono);
                font-size: 12px;
            }
        `,
    ],
    template: `
        <zyra-stack
            [direction]="$any(direction())"
            [gap]="$any(gap())"
            [align]="$any(align())"
            [justify]="$any(justify())"
            [wrap]="wrap()"
        >
            <div class="pg-stack-renderer__box">1</div>
            <div class="pg-stack-renderer__box">2</div>
            <div class="pg-stack-renderer__box">3</div>
        </zyra-stack>
    `,
})
export class StackRenderer {
    direction = input<string>('row');
    gap = input<string>('md');
    align = input<string>('center');
    justify = input<string>('start');
    wrap = input<boolean>(false);
}

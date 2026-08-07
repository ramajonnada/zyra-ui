import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraBox } from 'zyra-ng-ui';

@Component({
    selector: 'pg-box-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraBox],
    styles: [
        `
            .pg-box-renderer__label {
                font-family: var(--zyra-font-mono);
                font-size: 12px;
                color: var(--zyra-color-accent-hover);
            }
        `,
    ],
    template: `
        <zyra-box
            [padding]="$any(padding())"
            [rounded]="$any(rounded())"
            [background]="$any(background())"
            [shadow]="$any(shadow())"
            [border]="border()"
        >
            <span class="pg-box-renderer__label">zyra-box</span>
        </zyra-box>
    `,
})
export class BoxRenderer {
    padding = input<string>('md');
    rounded = input<string>('lg');
    background = input<string>('surface');
    shadow = input<string>('none');
    border = input<boolean>(false);
}

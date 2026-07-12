import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraContainer } from 'zyra-ng-ui';

@Component({
    selector: 'pg-container-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraContainer],
    styles: [
        `
            :host {
                display: block;
                width: 100%;
            }

            .pg-container-renderer__band {
                background: var(--zyra-color-accent-muted);
                color: var(--zyra-color-accent);
                border: 1px dashed var(--zyra-color-accent-border);
                border-radius: 8px;
                padding: 16px;
                text-align: center;
                font-family: var(--zyra-font-mono);
                font-size: 12px;
            }
        `,
    ],
    template: `
        <zyra-container [maxWidth]="$any(maxWidth())" [centered]="centered()" [fluid]="fluid()">
            <div class="pg-container-renderer__band">zyra-container</div>
        </zyra-container>
    `,
})
export class ContainerRenderer {
    maxWidth = input<string>('xl');
    centered = input<boolean>(true);
    fluid = input<boolean>(false);
}

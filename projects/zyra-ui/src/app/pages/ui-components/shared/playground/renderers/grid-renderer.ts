import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZyraGrid } from 'zyra-ng-ui';

@Component({
    selector: 'pg-grid-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraGrid],
    styles: [
        `
            :host { display: block; width: 100%; }

            .pg-grid-renderer__cell {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 52px;
                border-radius: 8px;
                background: var(--zyra-color-accent-muted);
                color: var(--zyra-color-accent);
                font-family: var(--zyra-font-mono);
                font-size: 12px;
            }
        `,
    ],
    template: `
        <zyra-grid [columns]="columnsValue()" [gap]="$any(gap())" [autoFlow]="$any(autoFlow())">
            @for (n of [1, 2, 3, 4, 5, 6]; track n) {
                <div class="pg-grid-renderer__cell">{{ n }}</div>
            }
        </zyra-grid>
    `,
})
export class GridRenderer {
    columns = input<string>('3');
    gap = input<string>('sm');
    autoFlow = input<string>('row');

    columnsValue = computed<number | string>(() => {
        const value = this.columns();
        return value === 'auto-fit' || value === 'auto-fill' ? value : Number(value);
    });
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraDivider } from 'zyra-ng-ui';

@Component({
    selector: 'pg-divider-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraDivider],
    styles: [':host { display: block; width: 100%; max-width: 480px; }'],
    template: `
        <p style="margin:0 0 8px; color: var(--zyr-text-muted); font-size:13px;">Above the divider</p>
        <zyra-divider
            [orientation]="$any(orientation())"
            [variant]="$any(variant())"
            [align]="$any(align())"
            [label]="label()"
        />
        <p style="margin:8px 0 0; color: var(--zyr-text-muted); font-size:13px;">Below the divider</p>
    `,
})
export class DividerRenderer {
    orientation = input<string>('horizontal');
    variant     = input<string>('solid');
    align       = input<string>('center');
    label       = input<string>('or');
}

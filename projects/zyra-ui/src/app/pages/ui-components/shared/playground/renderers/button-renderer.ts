import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraButton } from 'zyra-ng-ui';

@Component({
    selector: 'pg-button-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraButton],
    template: `
        <zyra-button
            [variant]="$any(variant())"
            [size]="$any(size())"
            [loading]="loading()"
            [disabled]="disabled()"
            [fullWidth]="fullWidth()"
            >{{ label() }}</zyra-button
        >
    `,
})
export class ButtonRenderer {
    variant = input<string>('primary');
    size = input<string>('md');
    loading = input<boolean>(false);
    disabled = input<boolean>(false);
    fullWidth = input<boolean>(false);
    label = input<string>('Button');
}

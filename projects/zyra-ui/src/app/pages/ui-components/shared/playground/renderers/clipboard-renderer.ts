import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraClipboard } from 'zyra-ng-ui';

@Component({
    selector: 'pg-clipboard-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraClipboard],
    template: `
        <zyra-clipboard
            [value]="value()"
            [label]="label()"
            [copiedLabel]="copiedLabel()"
            [size]="$any(size())"
            [variant]="$any(variant())"
        />
    `,
})
export class ClipboardRenderer {
    value = input<string>('npm install zyra-ng-ui');
    label = input<string>('Copy');
    copiedLabel = input<string>('Copied!');
    size = input<string>('md');
    variant = input<string>('button');
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraAlert } from 'zyra-ng-ui';

@Component({
    selector: 'pg-alert-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraAlert],
    styles: [':host { display: block; width: 100%; max-width: 480px; }'],
    template: `
        <zyra-alert [variant]="$any(variant())" [title]="title()" [dismissible]="dismissible()"
            >Your message here.</zyra-alert
        >
    `,
})
export class AlertRenderer {
    variant = input<string>('info');
    title = input<string>('Heads up');
    dismissible = input<boolean>(false);
}

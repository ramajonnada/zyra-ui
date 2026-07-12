import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ZyraConfirmDialog, ZyraButton } from 'zyra-ng-ui';

@Component({
    selector: 'pg-confirm-dialog-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraConfirmDialog, ZyraButton],
    template: `
        <zyra-button variant="danger" (clicked)="open.set(true)">Delete item</zyra-button>

        <zyra-confirm-dialog
            [open]="open()"
            (openChange)="open.set($event)"
            [title]="title()"
            [message]="message()"
            [tone]="$any(tone())"
            (confirmed)="open.set(false)"
        />
    `,
})
export class ConfirmDialogRenderer {
    title = input<string>('Delete item?');
    message = input<string>('This action cannot be undone.');
    tone = input<string>('danger');

    readonly open = signal(false);
}

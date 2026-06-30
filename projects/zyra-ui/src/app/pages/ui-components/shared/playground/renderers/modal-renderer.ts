import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ZyraModal, ZyraButton } from 'zyra-ng-ui';

@Component({
    selector: 'pg-modal-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraModal, ZyraButton],
    template: `
        <zyra-button variant="primary" (clicked)="open.set(true)">Launch modal</zyra-button>

        <zyra-modal
            [open]="open()"
            (openChange)="open.set($event)"
            [size]="$any(size())"
            [title]="title()"
            [dismissible]="dismissible()"
        >
            <p style="margin:0; color: var(--zyr-text-muted); line-height:1.6;">
                This is the modal body. You can place any content here.
            </p>
            <div slot="footer" style="display:flex; gap:8px; justify-content:flex-end;">
                <zyra-button variant="ghost" (clicked)="open.set(false)">Cancel</zyra-button>
                <zyra-button variant="primary" (clicked)="open.set(false)">Confirm</zyra-button>
            </div>
        </zyra-modal>
    `,
})
export class ModalRenderer {
    size = input<string>('md');
    title = input<string>('Confirm action');
    dismissible = input<boolean>(true);

    readonly open = signal(false);
}

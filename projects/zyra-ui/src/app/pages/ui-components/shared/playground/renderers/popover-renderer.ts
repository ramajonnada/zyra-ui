import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraButton, ZyraPopover } from 'zyra-ng-ui';

@Component({
    selector: 'pg-popover-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraPopover, ZyraButton],
    template: `
        <zyra-popover
            [position]="$any(position())"
            [trigger]="$any(trigger())"
            [closeOnOutsideClick]="closeOnOutsideClick()"
        >
            <zyra-button slot="trigger" variant="outline">Open popover</zyra-button>
            <div slot="content">
                <strong>Notifications</strong>
                <p>You have 3 unread messages waiting in your inbox.</p>
            </div>
        </zyra-popover>
    `,
})
export class PopoverRenderer {
    position = input<string>('bottom');
    trigger = input<string>('click');
    closeOnOutsideClick = input<boolean>(true);
}

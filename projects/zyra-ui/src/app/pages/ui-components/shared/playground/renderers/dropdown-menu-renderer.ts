import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraButton, ZyraDropdownMenu, ZyraMenuItem } from 'zyra-ng-ui';

@Component({
    selector: 'pg-dropdown-menu-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraDropdownMenu, ZyraMenuItem, ZyraButton],
    template: `
        <zyra-dropdown-menu [align]="$any(align())">
            <zyra-button slot="trigger" variant="outline">Actions</zyra-button>
            <zyra-menu-item>Edit</zyra-menu-item>
            <zyra-menu-item>Duplicate</zyra-menu-item>
            @if (danger()) {
                <zyra-menu-item variant="danger">Delete</zyra-menu-item>
            }
        </zyra-dropdown-menu>
    `,
})
export class DropdownMenuRenderer {
    align = input<string>('start');
    danger = input<boolean>(true);
}

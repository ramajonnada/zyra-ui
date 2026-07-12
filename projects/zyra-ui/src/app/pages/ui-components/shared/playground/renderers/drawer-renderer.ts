import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ZyraDrawer, ZyraButton } from 'zyra-ng-ui';

@Component({
    selector: 'pg-drawer-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraDrawer, ZyraButton],
    template: `
        <zyra-button variant="primary" (clicked)="open.set(true)">Open drawer</zyra-button>

        <zyra-drawer
            [open]="open()"
            (openChange)="open.set($event)"
            [side]="$any(side())"
            [size]="$any(size())"
            [title]="title()"
            [dismissible]="dismissible()"
        >
            <p style="margin:0; color: var(--zyra-color-foreground-muted); line-height:1.6;">
                This is the drawer body. You can place any content here.
            </p>
            <div slot="footer" style="display:flex; gap:8px; justify-content:flex-end;">
                <zyra-button variant="ghost" (clicked)="open.set(false)">Cancel</zyra-button>
                <zyra-button variant="primary" (clicked)="open.set(false)">Save</zyra-button>
            </div>
        </zyra-drawer>
    `,
})
export class DrawerRenderer {
    side = input<string>('right');
    size = input<string>('md');
    title = input<string>('Filters');
    dismissible = input<boolean>(true);

    readonly open = signal(false);
}

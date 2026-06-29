import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraAvatar } from 'zyra-ng-ui';

@Component({
    selector: 'pg-avatar-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraAvatar],
    template: `
        <zyra-avatar
            [name]="name()"
            [size]="$any(size())"
            [variant]="$any(variant())"
            [square]="square()"
        />
    `,
})
export class AvatarRenderer {
    name    = input<string>('Dev Zyra');
    size    = input<string>('md');
    variant = input<string>('teal');
    square  = input<boolean>(false);
}

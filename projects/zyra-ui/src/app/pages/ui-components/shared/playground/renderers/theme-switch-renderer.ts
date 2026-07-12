import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraThemeSwitch } from 'zyra-ng-ui';

@Component({
    selector: 'pg-theme-switch-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraThemeSwitch],
    template: `
        <zyra-theme-switch [mode]="$any(mode())" [disabled]="disabled()" />
    `,
})
export class ThemeSwitchRenderer {
    mode = input<string>('menu');
    disabled = input<boolean>(false);
}

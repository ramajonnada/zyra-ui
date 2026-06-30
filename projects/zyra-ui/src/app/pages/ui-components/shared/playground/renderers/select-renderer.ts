import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraSelect, ZyraOption } from 'zyra-ng-ui';

@Component({
    selector: 'pg-select-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraSelect, ZyraOption],
    styles: [':host { display: block; width: 100%; max-width: 320px; }'],
    template: `
        <zyra-select
            placeholder="Choose a framework…"
            [size]="$any(size())"
            [appearance]="$any(appearance())"
        >
            <zyra-option value="angular">Angular</zyra-option>
            <zyra-option value="react">React</zyra-option>
            <zyra-option value="vue">Vue</zyra-option>
            <zyra-option value="svelte">Svelte</zyra-option>
        </zyra-select>
    `,
})
export class SelectRenderer {
    size = input<string>('md');
    appearance = input<string>('outline');
}

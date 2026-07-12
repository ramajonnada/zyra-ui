import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraMultiSelect, ZyraOption } from 'zyra-ng-ui';

@Component({
    selector: 'pg-multi-select-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraMultiSelect, ZyraOption],
    styles: [':host { display: block; width: 100%; max-width: 320px; }'],
    template: `
        <zyra-multi-select
            placeholder="Choose frameworks…"
            [size]="$any(size())"
            [appearance]="$any(appearance())"
        >
            <zyra-option value="angular">Angular</zyra-option>
            <zyra-option value="react">React</zyra-option>
            <zyra-option value="vue">Vue</zyra-option>
            <zyra-option value="svelte">Svelte</zyra-option>
        </zyra-multi-select>
    `,
})
export class MultiSelectRenderer {
    size = input<string>('md');
    appearance = input<string>('outline');
}

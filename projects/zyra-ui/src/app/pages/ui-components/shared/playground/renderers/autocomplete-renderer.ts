import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraAutocomplete, ZyraOption } from 'zyra-ng-ui';

@Component({
    selector: 'pg-autocomplete-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraAutocomplete, ZyraOption],
    styles: [':host { display: block; width: 100%; max-width: 320px; }'],
    template: `
        <zyra-autocomplete
            placeholder="Search frameworks…"
            [size]="$any(size())"
            [appearance]="$any(appearance())"
        >
            <zyra-option value="angular">Angular</zyra-option>
            <zyra-option value="react">React</zyra-option>
            <zyra-option value="vue">Vue</zyra-option>
            <zyra-option value="svelte">Svelte</zyra-option>
        </zyra-autocomplete>
    `,
})
export class AutocompleteRenderer {
    size = input<string>('md');
    appearance = input<string>('outline');
}

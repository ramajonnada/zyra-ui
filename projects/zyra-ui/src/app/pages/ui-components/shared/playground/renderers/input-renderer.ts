import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraFormField, ZyraInput } from 'zyra-ng-ui';

@Component({
    selector: 'pg-input-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraFormField, ZyraInput],
    styles: [':host { display: block; width: 100%; max-width: 360px; }'],
    template: `
        <zyra-form-field
            label="Label"
            [hint]="hint()"
            [appearance]="$any(appearance())"
            [size]="$any(size())"
            [clearButton]="clearButton()"
            [loading]="loading()"
        >
            <zyra-input [type]="$any(type())" placeholder="Enter text…" />
        </zyra-form-field>
    `,
})
export class InputRenderer {
    type = input<string>('text');
    appearance = input<string>('outline');
    size = input<string>('md');
    hint = input<string>('This is a hint');
    clearButton = input<boolean>(false);
    loading = input<boolean>(false);
}

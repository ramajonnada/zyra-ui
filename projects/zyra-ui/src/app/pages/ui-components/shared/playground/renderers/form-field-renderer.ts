import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraFormField, ZyraInput } from 'zyra-ng-ui';

@Component({
    selector: 'pg-form-field-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraFormField, ZyraInput],
    styles: [':host { display: block; width: 100%; max-width: 360px; }'],
    template: `
        <zyra-form-field
            [label]="label()"
            [hint]="hint()"
            [appearance]="$any(appearance())"
            [size]="$any(size())"
        >
            <zyra-input placeholder="Enter text…" />
        </zyra-form-field>
    `,
})
export class FormFieldRenderer {
    appearance = input<string>('outline');
    size       = input<string>('md');
    label      = input<string>('Label');
    hint       = input<string>('');
}

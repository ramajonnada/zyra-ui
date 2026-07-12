import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraFormField, ZyraInput } from 'zyra-ng-ui';

@Component({
    selector: 'pg-password-input-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraFormField, ZyraInput],
    styles: [':host { display: block; width: 100%; max-width: 360px; }'],
    template: `
        <zyra-form-field
            label="Password"
            hint="Click the eye icon to reveal your password"
            [appearance]="$any(appearance())"
            [size]="$any(size())"
        >
            <zyra-input type="password" placeholder="Enter password…" />
        </zyra-form-field>
    `,
})
export class PasswordInputRenderer {
    appearance = input<string>('outline');
    size = input<string>('md');
}

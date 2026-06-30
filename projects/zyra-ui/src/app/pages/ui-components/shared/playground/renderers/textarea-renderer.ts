import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraFormField, ZyraTextarea } from 'zyra-ng-ui';

@Component({
    selector: 'pg-textarea-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraFormField, ZyraTextarea],
    styles: [':host { display: block; width: 100%; max-width: 400px; }'],
    template: `
        <zyra-form-field label="Message">
            <zyra-textarea
                [size]="$any(size())"
                [resize]="$any(resize())"
                placeholder="Enter your message…"
            />
        </zyra-form-field>
    `,
})
export class TextareaRenderer {
    size = input<string>('md');
    resize = input<string>('vertical');
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraFileUpload } from 'zyra-ng-ui';

@Component({
    selector: 'pg-file-upload-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraFileUpload],
    styles: [':host { display: block; width: 100%; max-width: 420px; }'],
    template: `
        <zyra-file-upload [multiple]="multiple()" [disabled]="disabled()" />
    `,
})
export class FileUploadRenderer {
    multiple = input<boolean>(false);
    disabled = input<boolean>(false);
}

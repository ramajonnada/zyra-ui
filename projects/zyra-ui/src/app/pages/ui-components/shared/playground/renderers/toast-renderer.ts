import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ZyraButton, ZyraToastContainer, ZyraToastService } from 'zyra-ng-ui';

@Component({
    selector: 'pg-toast-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraButton, ZyraToastContainer],
    template: `
        <zyra-button variant="primary" (clicked)="fire()">Show toast</zyra-button>
        <zyra-toast-container />
    `,
})
export class ToastRenderer {
    private toast = inject(ZyraToastService);

    variant     = input<string>('success');
    title       = input<string>('Operation completed');
    description = input<string>('Your changes have been saved.');
    persistent  = input<boolean>(false);

    fire(): void {
        const opts = {
            description: this.description(),
            duration: this.persistent() ? 0 : 4000,
        };
        const v = this.variant();
        if (v === 'success') this.toast.success(this.title(), opts);
        else if (v === 'error') this.toast.error(this.title(), opts);
        else if (v === 'warning') this.toast.warning(this.title(), opts);
        else this.toast.info(this.title(), opts);
    }
}

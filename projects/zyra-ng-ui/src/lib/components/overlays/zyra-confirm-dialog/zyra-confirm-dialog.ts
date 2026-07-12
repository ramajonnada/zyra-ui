import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model, output } from '@angular/core';
import { ZyraModal } from '../zyra-modal/zyra-modal';
import { ZyraButton, ButtonVariant } from '../../actions/zyra-button/zyra-button';

export type ConfirmDialogTone = 'default' | 'danger';

@Component({
    selector: 'zyra-confirm-dialog',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraModal, ZyraButton],
    templateUrl: './zyra-confirm-dialog.html',
    styleUrl: './zyra-confirm-dialog.scss',
})
export class ZyraConfirmDialog {
    // ── Inputs ────────────────────────────────────────────────
    open = model<boolean>(false);
    title = input<string>('Are you sure?');
    message = input<string>('');
    tone = input<ConfirmDialogTone>('default');
    confirmLabel = input<string>('Confirm');
    cancelLabel = input<string>('Cancel');
    loading = input(false, { transform: booleanAttribute });
    dismissible = input(true, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────
    confirmed = output<void>();
    cancelled = output<void>();

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => 'zyr-confirm-dialog');
    confirmVariant = computed<ButtonVariant>(() => (this.tone() === 'danger' ? 'danger' : 'primary'));

    // ── Methods ───────────────────────────────────────────────
    confirm(): void {
        if (this.loading()) return;
        this.confirmed.emit();
    }

    cancel(): void {
        if (this.loading()) return;
        this.open.set(false);
        this.cancelled.emit();
    }

    onModalClosed(): void {
        this.cancelled.emit();
    }
}

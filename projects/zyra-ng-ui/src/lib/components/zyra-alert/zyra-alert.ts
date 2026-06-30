import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

const ICONS: Record<AlertVariant, string> = {
    success: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2.5 8.5 6 12 13.5 4"/></svg>`,
    warning: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 2L14.5 13.5H1.5L8 2Z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12.5" r="0.5" fill="currentColor"/></svg>`,
    danger: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`,
    info: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.5" fill="currentColor"/></svg>`,
};

@Component({
    selector: 'zyra-alert',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-alert.html',
    styleUrl: './zyra-alert.scss',
})
export class ZyraAlert {
    private readonly _sanitizer = inject(DomSanitizer);

    // ── Inputs ────────────────────────────────────────────────
    variant = input<AlertVariant>('info');
    title = input<string>('');
    dismissible = input(false, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────
    dismissed = output<void>();

    // ── State ─────────────────────────────────────────────────
    dismissing = signal(false);

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(
        () =>
            `zyr-alert zyr-alert--${this.variant()}${this.dismissing() ? ' zyr-alert--dismissing' : ''}`,
    );
    icon = computed<SafeHtml>(() => this._sanitizer.bypassSecurityTrustHtml(ICONS[this.variant()]));

    // ── Methods ───────────────────────────────────────────────
    dismiss(): void {
        this.dismissing.set(true);
    }

    onAnimationEnd(): void {
        if (this.dismissing()) {
            this.dismissed.emit();
        }
    }
}

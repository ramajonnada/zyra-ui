import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ZyraIcon } from '../../../internal/zyra-icon/zyra-icon';
import { check, copy } from '../../../shared/zyra-icons';

export type ClipboardSize = 'sm' | 'md' | 'lg';
export type ClipboardVariant = 'button' | 'icon';

@Component({
    selector: 'zyra-clipboard',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIcon],
    templateUrl: './zyra-clipboard.html',
    styleUrl: './zyra-clipboard.scss',
})
export class ZyraClipboard {
    // ── Inputs ────────────────────────────────────────────────
    value = input<string>('');
    label = input<string>('Copy');
    copiedLabel = input<string>('Copied!');
    size = input<ClipboardSize>('md');
    variant = input<ClipboardVariant>('button');

    // ── Outputs ───────────────────────────────────────────────
    copied = output<void>();

    // ── State ─────────────────────────────────────────────────
    justCopied = signal(false);

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => {
        const classes = ['zyr-clipboard', `zyr-clipboard--${this.size()}`, `zyr-clipboard--${this.variant()}`];
        if (this.justCopied()) classes.push('zyr-clipboard--copied');
        return classes.join(' ');
    });

    icon = computed(() => (this.justCopied() ? check : copy));

    currentLabel = computed(() => (this.justCopied() ? this.copiedLabel() : this.label()));

    ariaLabel = computed(() => (this.variant() === 'icon' ? this.currentLabel() : null));

    // ── Methods ───────────────────────────────────────────────
    async handleClick(): Promise<void> {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(this.value());
        }
        this.justCopied.set(true);
        this.copied.emit();
        setTimeout(() => this.justCopied.set(false), 2000);
    }
}

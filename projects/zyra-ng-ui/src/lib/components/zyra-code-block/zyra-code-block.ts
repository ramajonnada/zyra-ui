import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ZyraIcon } from '../../internal/zyra-icon/zyra-icon';
import { check, copy } from '../../shared/zyra-icons';
import { tokenizeCode } from './zyra-code-block-tokenizer';

@Component({
    selector: 'zyra-code-block',
    standalone: true,
    imports: [ZyraIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-code-block.html',
    styleUrl: './zyra-code-block.scss',
})
export class ZyraCodeBlock {
    // ── Inputs ────────────────────────────────────────────────
    code = input<string>('');
    language = input<string>('');
    filename = input<string>('');
    lineNumbers = input(false, { transform: booleanAttribute });
    copyable = input(true, { transform: booleanAttribute });

    // ── Icons ─────────────────────────────────────────────────
    readonly copyIcon = copy;
    readonly checkIcon = check;

    // ── State ─────────────────────────────────────────────────
    copied = signal(false);

    // ── Computed ──────────────────────────────────────────────
    hasHeader = computed(() => !!this.filename() || !!this.language() || this.copyable());
    lines = computed(() => tokenizeCode(this.code(), this.language()));

    // ── Methods ───────────────────────────────────────────────
    async copyToClipboard(): Promise<void> {
        if (this.copied()) {
            return;
        }
        try {
            await navigator.clipboard.writeText(this.code());
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        } catch {
            // Clipboard API unavailable — silently ignore.
        }
    }
}

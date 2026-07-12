import { booleanAttribute, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
    selector: 'zyra-step',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (active()) {
            <div class="zyr-step__content">
                <ng-content />
            </div>
        }
    `,
})
export class ZyraStep {
    // ── Inputs ────────────────────────────────────────────────
    label = input<string>('');
    description = input<string>('');
    completed = input(false, { transform: booleanAttribute });
    disabled = input(false, { transform: booleanAttribute });

    // ── Set by the parent ZyraStepper via contentChildren() ────
    readonly active = signal(false);
}

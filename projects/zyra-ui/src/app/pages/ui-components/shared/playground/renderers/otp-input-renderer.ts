import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ZyraInput } from 'zyra-ng-ui';

@Component({
    selector: 'pg-otp-input-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraInput],
    styles: [
        ':host { display: block; width: 100%; }',
        '.pg-otp-demo__hint { margin: 12px 0 0; font-size: 12.5px; color: var(--zyra-color-text-muted); }',
        '.pg-otp-demo__hint code { color: var(--zyra-color-text); }',
    ],
    template: `
        <div class="pg-otp-demo">
            <zyra-input
                [otpLength]="otpLength()"
                [otpType]="$any(otpType())"
                [size]="$any(size())"
                (complete)="completed.set($event)"
            />
            <p class="pg-otp-demo__hint">
                Completed code: <code>{{ completed() || '—' }}</code>
            </p>
        </div>
    `,
})
export class OtpInputRenderer {
    length = input<string>('6');
    otpType = input<string>('numeric');
    size = input<string>('md');

    readonly otpLength = computed(() => Number(this.length()));
    readonly completed = signal('');
}

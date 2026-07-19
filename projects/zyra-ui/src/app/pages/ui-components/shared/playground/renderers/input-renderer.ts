import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { search, ZyraFormField, ZyraInput, type ZyraIconData } from 'zyra-ng-ui';

@Component({
    selector: 'pg-input-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraFormField, ZyraInput],
    styles: [
        ':host { display: block; width: 100%; max-width: 360px; }',
        '.pg-input-demo__hint { margin: 8px 0 0; font-size: 12.5px; color: var(--zyra-color-text-muted); }',
        '.pg-input-demo__hint code { color: var(--zyra-color-text); }',
    ],
    template: `
        <div class="pg-input-demo">
            <zyra-form-field
                label="Label"
                [hint]="hint()"
                [appearance]="$any(appearance())"
                [size]="$any(size())"
                [clearButton]="clearButton()"
                [loading]="loading()"
                [prefixIcon]="prefixIcon()"
            >
                <zyra-input
                    [type]="$any(type())"
                    placeholder="Enter text…"
                    [debounce]="debounce() ? 300 : 0"
                    (searched)="lastSearch.set($event)"
                />
            </zyra-form-field>
            @if (debounce()) {
                <p class="pg-input-demo__hint">
                    Debounced search: <code>{{ lastSearch() || '—' }}</code>
                </p>
            }
        </div>
    `,
})
export class InputRenderer {
    type = input<string>('text');
    appearance = input<string>('outline');
    size = input<string>('md');
    hint = input<string>('This is a hint');
    clearButton = input<boolean>(false);
    loading = input<boolean>(false);
    debounce = input<boolean>(false);

    readonly lastSearch = signal('');
    readonly prefixIcon = computed<ZyraIconData | ''>(() => (this.type() === 'search' ? search : ''));
}

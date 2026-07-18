import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerValue, ZyraDatePicker } from 'zyra-ng-ui';

@Component({
    selector: 'pg-date-picker-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ZyraDatePicker],
    styles: [':host { display: block; width: 100%; max-width: 320px; }'],
    template: `
        <zyra-date-picker
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            [appearance]="$any(appearance())"
            [size]="$any(size())"
            [selectionMode]="$any(selectionMode())"
            [disabled]="disabled()"
        />
    `,
})
export class DatePickerRenderer {
    appearance = input<string>('outline');
    size = input<string>('md');
    selectionMode = input<string>('single');
    disabled = input<boolean>(false);

    readonly value = signal<DatePickerValue>(null);

    constructor() {
        // Reset the value whenever the selection mode changes so the demo never
        // holds a value shape (Date vs range) that doesn't match the mode.
        effect(() => {
            this.selectionMode();
            this.value.set(null);
        });
    }
}

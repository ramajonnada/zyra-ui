import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarValue, ZyraCalendar } from 'zyra-ng-ui';

@Component({
    selector: 'pg-calendar-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ZyraCalendar],
    styles: [':host { display: block; width: 100%; max-width: 320px; }'],
    template: `
        <zyra-calendar
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            [selectionMode]="$any(selectionMode())"
            [disabled]="disabled()"
        />
    `,
})
export class CalendarRenderer {
    selectionMode = input<string>('single');
    disabled = input<boolean>(false);

    readonly value = signal<CalendarValue>(null);

    constructor() {
        // Reset the value whenever the selection mode changes so the demo never
        // holds a value shape (Date vs Date[] vs range) that doesn't match the mode.
        effect(() => {
            this.selectionMode();
            this.value.set(null);
        });
    }
}

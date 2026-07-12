import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraSlider } from 'zyra-ng-ui';

@Component({
    selector: 'pg-slider-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ZyraSlider],
    styles: [':host { display: block; width: 100%; max-width: 360px; }'],
    template: `
        <zyra-slider
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            [size]="$any(size())"
            [showValue]="showValue()"
            [disabled]="disabled()"
        />
    `,
})
export class SliderRenderer {
    size = input<string>('md');
    showValue = input<boolean>(true);
    disabled = input<boolean>(false);

    readonly value = signal(40);
}

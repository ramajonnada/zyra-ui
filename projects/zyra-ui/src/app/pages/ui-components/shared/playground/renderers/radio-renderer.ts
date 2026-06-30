import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraRadio, ZyraRadioGroup } from 'zyra-ng-ui';

@Component({
    selector: 'pg-radio-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ZyraRadioGroup, ZyraRadio],
    template: `
        <zyra-radio-group [orientation]="$any(orientation())" [disabled]="disabled()">
            <zyra-radio value="angular">Angular</zyra-radio>
            <zyra-radio value="react">React</zyra-radio>
            <zyra-radio value="vue">Vue</zyra-radio>
        </zyra-radio-group>
    `,
})
export class RadioRenderer {
    orientation = input<string>('vertical');
    disabled = input<boolean>(false);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraButton, ZyraFormField, ZyraInput } from 'zyra-ng-ui';
import {
    ButtonGroupControl,
    ControlDef,
    TextControl,
    ToggleControl,
} from './control-def';

@Component({
    selector: 'app-controls',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ZyraButton, ZyraFormField, ZyraInput],
    templateUrl: './controls.html',
    styleUrl: './controls.scss',
})
export class Controls {
    readonly controls = input<ControlDef[]>([]);

    asBtnGroup(c: ControlDef): ButtonGroupControl {
        return c as ButtonGroupControl;
    }

    asToggle(c: ControlDef): ToggleControl {
        return c as ToggleControl;
    }

    asText(c: ControlDef): TextControl {
        return c as TextControl;
    }
}

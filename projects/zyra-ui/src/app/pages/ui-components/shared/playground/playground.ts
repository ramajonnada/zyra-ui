import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { signal } from '@angular/core';
import { Controls } from '../controls/controls';
import { Preview } from '../preview/preview';
import { PlaygroundConfig } from './playground-config';
import { ControlDef } from '../controls/control-def';

@Component({
    selector: 'app-playground',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgComponentOutlet, Controls, Preview],
    templateUrl: './playground.html',
    styleUrl: './playground.scss',
})
export class Playground {
    readonly config = input.required<PlaygroundConfig>();

    // Create one WritableSignal per control keyed by control.key.
    // Recomputes only when config reference changes (page navigation).
    readonly _signalMap = computed(() => {
        const map: Record<string, ReturnType<typeof signal<unknown>>> = {};
        for (const ctrl of this.config().controls) {
            map[ctrl.key] = signal(ctrl.defaultValue);
        }
        return map;
    });

    // ControlDef[] with signals attached — consumed by app-controls
    readonly controlDefs = computed<ControlDef[]>(() => {
        const map = this._signalMap();
        return this.config().controls.map((ctrl): ControlDef => {
            if (ctrl.type === 'toggle') {
                return {
                    type: 'toggle',
                    key: ctrl.key,
                    label: ctrl.label,
                    toggleLabel: ctrl.toggleLabel,
                    signal: map[ctrl.key] as ReturnType<typeof signal<boolean>>,
                };
            }
            if (ctrl.type === 'text') {
                return {
                    type: 'text',
                    key: ctrl.key,
                    label: ctrl.label,
                    placeholder: ctrl.placeholder,
                    signal: map[ctrl.key] as ReturnType<typeof signal<string>>,
                };
            }
            return {
                type: 'button-group',
                key: ctrl.key,
                label: ctrl.label,
                options: ctrl.options,
                signal: map[ctrl.key] as ReturnType<typeof signal<string>>,
            };
        });
    });

    // Plain value snapshot — reads every signal so computed re-runs on any change.
    // Used as NgComponentOutlet inputs and passed to codeTemplate.
    readonly state = computed<Record<string, unknown>>(() => {
        const map = this._signalMap();
        const result: Record<string, unknown> = {};
        for (const [key, sig] of Object.entries(map)) {
            result[key] = sig();
        }
        return result;
    });

    readonly code = computed(() => this.config().codeTemplate(this.state()));
}

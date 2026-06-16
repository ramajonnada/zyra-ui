import { Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ZyraRadio, ZyraRadioGroup, ZyraButton, ZyraCard } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-radio',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, ZyraRadio, ZyraRadioGroup, ZyraButton, ZyraCard, Controls],
    templateUrl: './radio.html',
    styleUrl: './radio.scss',
})
export class Radio {
    playValue   = signal<string | null>(null);
    orientation = signal<'vertical' | 'horizontal'>('vertical');
    disabled    = signal(false);
    copied      = signal(false);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'orientation',
            label: 'orientation',
            options: ['vertical', 'horizontal'],
            signal: this.orientation as ReturnType<typeof signal<string>>,
        },
        {
            type: 'toggle',
            key: 'disabled',
            label: 'boolean inputs',
            toggleLabel: 'disabled',
            signal: this.disabled,
        },
    ];

    generatedCode = computed(() => {
        const attrs: string[] = [];
        if (this.orientation() !== 'vertical') attrs.push(`  orientation="${this.orientation()}"`);
        if (this.disabled()) attrs.push(`  [disabled]="true"`);

        const open = attrs.length === 0
            ? `<zyra-radio-group [(ngModel)]="value">`
            : [`<zyra-radio-group [(ngModel)]="value"`, ...attrs, `>`].join('\n');

        return [open, `  <zyra-option value="angular">Angular</zyra-option>`, `  <zyra-option value="react">React</zyra-option>`, `</zyra-radio-group>`].join('\n');
    });

    planCtrl = new FormControl('starter', Validators.required);

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.playValue.set(null);
        this.orientation.set('vertical');
        this.disabled.set(false);
    }
}

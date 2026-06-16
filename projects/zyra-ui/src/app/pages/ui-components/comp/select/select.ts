import { Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ZyraButton, ZyraCard, ZyraSelect, ZyraOption, SelectSize, SelectAppearance } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, ZyraSelect, ZyraOption, ZyraButton, ZyraCard, Controls],
    templateUrl: './select.html',
    styleUrl: './select.scss',
})
export class Select {
    // ── Playground state ──────────────────────────────────────
    size = signal<SelectSize>('md');
    appearance = signal<SelectAppearance>('outline');
    disabled = signal(false);
    playgroundValue = signal<string | null>(null);
    copied = signal(false);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['sm', 'md', 'lg'],
            signal: this.size as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'appearance',
            label: 'appearance',
            options: ['outline', 'filled', 'underline'],
            signal: this.appearance as ReturnType<typeof signal<string>>,
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
        if (this.size() !== 'md') attrs.push(`  size="${this.size()}"`);
        if (this.appearance() !== 'outline') attrs.push(`  appearance="${this.appearance()}"`);
        if (this.disabled()) attrs.push(`  [disabled]="true"`);

        const tag = attrs.length === 0
            ? `<zyra-select>`
            : [`<zyra-select`, ...attrs, `>`].join('\n');

        return [
            tag,
            `  <zyra-option value="react">React</zyra-option>`,
            `  <zyra-option value="angular">Angular</zyra-option>`,
            `  <zyra-option value="vue">Vue</zyra-option>`,
            `</zyra-select>`,
        ].join('\n');
    });

    // ── Profile form example ──────────────────────────────────
    profileForm = new FormGroup({
        country: new FormControl('', Validators.required),
        timezone: new FormControl('', Validators.required),
        language: new FormControl('en'),
    });

    profileSubmitted = signal(false);
    formResult = signal<string | null>(null);

    submitProfile(): void {
        this.profileForm.markAllAsTouched();
        if (this.profileForm.invalid) return;
        this.formResult.set(JSON.stringify(this.profileForm.value, null, 2));
        this.profileSubmitted.set(true);
    }

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.size.set('md');
        this.appearance.set('outline');
        this.disabled.set(false);
        this.playgroundValue.set(null);
    }
}

import { Component, computed, inject, signal } from '@angular/core';
import { ZyraSpinner, ZyraButton, ZyraBadge, ZyraCard, ZyraToastContainer, ZyraToastService, ZyraThemeService, SpinnerSize, SpinnerColor } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-spinner',
    standalone: true,
    templateUrl: './spinner.html',
    styleUrl: './spinner.scss',
    imports: [ZyraSpinner, ZyraButton, ZyraBadge, ZyraCard, ZyraToastContainer, Controls],
})
export class Spinner {
    themeService = inject(ZyraThemeService);
    toastService = inject(ZyraToastService);

    codeCopied = signal(false);
    private copyResetTimer?: ReturnType<typeof setTimeout>;

    size = signal<SpinnerSize>('md');
    color = signal<SpinnerColor>('accent');
    label = signal('Loading...');

    readonly sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg'];
    readonly colors: SpinnerColor[] = ['accent', 'accent-2', 'white', 'current'];

    btn1Loading = signal(false);
    btn2Loading = signal(false);
    btn3Loading = signal(false);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['xs', 'sm', 'md', 'lg'],
            signal: this.size as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'color',
            label: 'color',
            options: ['accent', 'accent-2', 'white', 'current'],
            signal: this.color as ReturnType<typeof signal<string>>,
        },
        {
            type: 'text',
            key: 'label',
            label: 'label (aria)',
            placeholder: 'Loading...',
            signal: this.label,
        },
    ];

    simulate(which: 1 | 2 | 3, ms = 2000): void {
        if (which === 1) {
            this.btn1Loading.set(true);
            setTimeout(() => { this.btn1Loading.set(false); this.toastService.success('Saved!'); }, ms);
        }
        if (which === 2) {
            this.btn2Loading.set(true);
            setTimeout(() => { this.btn2Loading.set(false); this.toastService.info('Uploaded!'); }, ms);
        }
        if (which === 3) {
            this.btn3Loading.set(true);
            setTimeout(() => { this.btn3Loading.set(false); this.toastService.error('Failed - try again'); }, ms);
        }
    }

    reset(): void {
        this.size.set('md');
        this.color.set('accent');
        this.label.set('Loading...');
    }

    copyCode(): void {
        navigator.clipboard.writeText(this.generatedCode());
        this.toastService.success('Code copied to clipboard!');
        this.codeCopied.set(true);
        clearTimeout(this.copyResetTimer);
        this.copyResetTimer = setTimeout(() => this.codeCopied.set(false), 2000);
    }

    generatedCode = computed(() => {
        const label = this.label().trim();
        if (label) {
            return `<zyra-spinner size="${this.size()}" color="${this.color()}"\n  label="${label}"\n/>`;
        }
        return `<zyra-spinner size="${this.size()}" color="${this.color()}" />`;
    });
}

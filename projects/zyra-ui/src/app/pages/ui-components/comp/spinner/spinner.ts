// projects/zyra-ui/src/app/pages/test/spinner/spinner.ts

import { Component, computed, inject, signal } from '@angular/core';
import {
    ZyraSpinner,
    ZyraButton,
    ZyraBadge,
    ZyraCard,
    ZyraToastContainer,
    ZyraToastService,
    ZyraThemeService,
    SpinnerSize,
    SpinnerColor,
} from 'zyra-ng-ui';

@Component({
    selector: 'app-spinner',
    standalone: true,
    templateUrl: './spinner.html',
    styleUrl: './spinner.scss',
    imports: [ZyraSpinner, ZyraButton, ZyraBadge, ZyraCard, ZyraToastContainer],
})
export class Spinner {
    themeService = inject(ZyraThemeService);
    toastService = inject(ZyraToastService);

    size = signal<SpinnerSize>('md');
    color = signal<SpinnerColor>('accent');
    label = signal('Loading...');

    sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg'];
    colors: SpinnerColor[] = ['accent', 'accent-2', 'white', 'current'];

    btn1Loading = signal(false);
    btn2Loading = signal(false);
    btn3Loading = signal(false);

    simulate(which: 1 | 2 | 3, ms = 2000): void {
        if (which === 1) {
            this.btn1Loading.set(true);
            setTimeout(() => {
                this.btn1Loading.set(false);
                this.toastService.success('Saved!');
            }, ms);
        }
        if (which === 2) {
            this.btn2Loading.set(true);
            setTimeout(() => {
                this.btn2Loading.set(false);
                this.toastService.info('Uploaded!');
            }, ms);
        }
        if (which === 3) {
            this.btn3Loading.set(true);
            setTimeout(() => {
                this.btn3Loading.set(false);
                this.toastService.error('Failed - try again');
            }, ms);
        }
    }

    reset(): void {
        this.size.set('md');
        this.color.set('accent');
        this.label.set('Loading...');
    }

    copyCode(): void {
        const code = this.generatedCode();
        navigator.clipboard.writeText(code);
        this.toastService.success('Code copied to clipboard!');
    }

    generatedCode = computed(() => {
        let code = `<zyra-spinner size="${this.size()}" color="${this.color()}"`;

        if (this.label().trim()) {
            code += `\n  label="${this.escapeAttribute(this.label())}"`;
        }

        code += `\n/>`;
        return code;
    });

    private escapeAttribute(value: string): string {
        return value.replaceAll('"', '&quot;');
    }
}

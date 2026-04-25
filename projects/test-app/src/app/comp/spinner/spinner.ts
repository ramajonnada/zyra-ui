// projects/zyra-ui/src/app/pages/test/spinner/spinner.ts

import { Component, inject, signal } from '@angular/core';
import {
    ZyraSpinner,
    ZyraButton,
    ZyraBadge,
    ZyraCard,
    ZyraTooltip,
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
    imports: [ZyraSpinner, ZyraButton, ZyraBadge, ZyraCard, ZyraTooltip, ZyraToastContainer],
})
export class Spinner {
    themeService = inject(ZyraThemeService);
    toastService = inject(ZyraToastService);

    // ── Playground controls ───────────────────────────────────
    size = signal<SpinnerSize>('md');
    color = signal<SpinnerColor>('accent');
    label = signal('Loading…');

    sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg'];
    colors: SpinnerColor[] = ['accent', 'accent-2', 'white', 'current'];

    // ── Button loading simulation ─────────────────────────────
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
                this.toastService.error('Failed — try again');
            }, ms);
        }
    }

    reset(): void {
        this.size.set('md');
        this.color.set('accent');
        this.label.set('Loading…');
    }
}

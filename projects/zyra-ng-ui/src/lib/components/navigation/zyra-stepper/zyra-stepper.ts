import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    effect,
    input,
    output,
} from '@angular/core';
import { ZyraIcon } from '../../../internal/zyra-icon/zyra-icon';
import { check } from '../../../shared/zyra-icons';
import { ZyraStep } from './zyra-step';

export type StepperOrientation = 'horizontal' | 'vertical';

@Component({
    selector: 'zyra-stepper',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIcon],
    templateUrl: './zyra-stepper.html',
    styleUrl: './zyra-stepper.scss',
})
export class ZyraStepper {
    // ── Inputs ────────────────────────────────────────────────
    activeIndex = input<number>(0);
    orientation = input<StepperOrientation>('horizontal');

    // ── Outputs ───────────────────────────────────────────────
    activeIndexChange = output<number>();

    readonly steps = contentChildren(ZyraStep);

    readonly icons = { check };

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => `zyr-stepper zyr-stepper--${this.orientation()}`);

    constructor() {
        effect(() => {
            const index = this.activeIndex();
            this.steps().forEach((step, i) => step.active.set(i === index));
        });
    }

    // ── Methods ───────────────────────────────────────────────
    indicatorClass(index: number, step: ZyraStep): string {
        const base = 'zyr-stepper__indicator';
        const parts = [base];
        if (index === this.activeIndex()) parts.push(`${base}--active`);
        if (step.completed()) parts.push(`${base}--completed`);
        if (step.disabled()) parts.push(`${base}--disabled`);
        return parts.join(' ');
    }

    selectStep(index: number, step: ZyraStep): void {
        if (step.disabled()) return;
        this.activeIndexChange.emit(index);
    }
}

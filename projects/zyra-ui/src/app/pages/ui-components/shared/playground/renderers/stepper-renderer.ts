import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ZyraStep, ZyraStepper } from 'zyra-ng-ui';

@Component({
    selector: 'pg-stepper-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraStepper, ZyraStep],
    styles: [':host { display: block; width: 100%; }'],
    template: `
        <zyra-stepper
            [activeIndex]="activeIndex()"
            [orientation]="$any(orientation())"
            (activeIndexChange)="activeIndex.set($event)"
        >
            <zyra-step label="Account" description="Create your account" [completed]="activeIndex() > 0">
                Set up your username and password to get started.
            </zyra-step>
            <zyra-step label="Profile" description="Tell us about yourself" [completed]="activeIndex() > 1">
                Add your name, avatar, and a short bio.
            </zyra-step>
            <zyra-step label="Review" description="Confirm and finish">
                Review your details and submit to complete setup.
            </zyra-step>
        </zyra-stepper>
    `,
})
export class StepperRenderer {
    orientation = input<string>('horizontal');
    activeIndex = signal(0);
}

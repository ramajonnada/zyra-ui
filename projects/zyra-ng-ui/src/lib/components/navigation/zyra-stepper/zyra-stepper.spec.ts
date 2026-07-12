import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraStep } from './zyra-step';
import { ZyraStepper } from './zyra-stepper';

@Component({
    standalone: true,
    imports: [ZyraStepper, ZyraStep],
    template: `
        <zyra-stepper [activeIndex]="activeIndex()" (activeIndexChange)="activeIndex.set($event)">
            <zyra-step label="Account" description="Create your account" [completed]="true">
                Account content
            </zyra-step>
            <zyra-step label="Profile" description="Tell us about yourself">
                Profile content
            </zyra-step>
            <zyra-step label="Review" [disabled]="true"> Review content </zyra-step>
        </zyra-stepper>
    `,
})
class StepperHostComponent {
    activeIndex = signal(0);
}

describe('ZyraStepper', () => {
    let fixture: ComponentFixture<StepperHostComponent>;
    let host: StepperHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [StepperHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(StepperHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Indicators ────────────────────────────────────────────────────────
    it('renders an indicator per step', () => {
        expect(fixture.nativeElement.querySelectorAll('.zyr-stepper__indicator').length).toBe(3);
    });

    it('renders step labels and descriptions', () => {
        const labels: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-stepper__label');
        expect(labels[0].textContent).toContain('Account');
        expect(labels[1].textContent).toContain('Profile');
    });

    it('marks the active indicator', () => {
        const indicators: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-stepper__indicator');
        expect(indicators[0].classList).toContain('zyr-stepper__indicator--active');
    });

    it('marks completed indicators', () => {
        const indicators: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-stepper__indicator');
        expect(indicators[0].classList).toContain('zyr-stepper__indicator--completed');
    });

    it('marks disabled indicators', () => {
        const indicators: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-stepper__indicator');
        expect(indicators[2].classList).toContain('zyr-stepper__indicator--disabled');
        expect((indicators[2] as HTMLButtonElement).disabled).toBe(true);
    });

    // ── Active step content ───────────────────────────────────────────────
    it('renders only the active step content', () => {
        const content: HTMLElement = fixture.nativeElement.querySelector('.zyr-stepper__body');
        expect(content.textContent).toContain('Account content');
        expect(content.textContent).not.toContain('Profile content');
    });

    it('updates rendered content when activeIndex changes', () => {
        host.activeIndex.set(1);
        fixture.detectChanges();
        const content: HTMLElement = fixture.nativeElement.querySelector('.zyr-stepper__body');
        expect(content.textContent).toContain('Profile content');
        expect(content.textContent).not.toContain('Account content');
    });

    // ── Navigation ────────────────────────────────────────────────────────
    it('emits activeIndexChange when a non-disabled indicator is clicked', () => {
        const indicators: NodeListOf<HTMLButtonElement> =
            fixture.nativeElement.querySelectorAll('.zyr-stepper__indicator');
        indicators[1].click();
        fixture.detectChanges();
        expect(host.activeIndex()).toBe(1);
    });

    it('does not emit activeIndexChange when a disabled indicator is clicked', () => {
        const indicators: NodeListOf<HTMLButtonElement> =
            fixture.nativeElement.querySelectorAll('.zyr-stepper__indicator');
        indicators[2].click();
        fixture.detectChanges();
        expect(host.activeIndex()).toBe(0);
    });

    // ── Orientation ───────────────────────────────────────────────────────
    it('applies horizontal orientation class by default', () => {
        expect(
            fixture.nativeElement.querySelector('.zyr-stepper--horizontal'),
        ).not.toBeNull();
    });
});

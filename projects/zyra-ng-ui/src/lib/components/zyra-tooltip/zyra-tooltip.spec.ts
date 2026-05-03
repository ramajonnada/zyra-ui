import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraTooltip } from './zyra-tooltip';

@Component({
    standalone: true,
    imports: [ZyraTooltip],
    template: `
        <zyra-tooltip text="Helpful tip" position="right">
            <button type="button">Trigger</button>
        </zyra-tooltip>
    `,
})
class TooltipHostComponent {}

describe('ZyraTooltip', () => {
    let fixture: ComponentFixture<TooltipHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TooltipHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TooltipHostComponent);
        fixture.detectChanges();
    });

    it('shows and hides the tooltip on pointer interaction', () => {
        const wrap: HTMLElement = fixture.nativeElement.querySelector('.zyr-tooltip-wrap');
        wrap.dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();

        let tooltip: HTMLElement | null = fixture.nativeElement.querySelector('.zyr-tooltip');
        expect(tooltip).not.toBeNull();
        expect(tooltip?.className).toContain('zyr-tooltip--right');
        expect(tooltip?.textContent).toContain('Helpful tip');

        wrap.dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();

        tooltip = fixture.nativeElement.querySelector('.zyr-tooltip');
        expect(tooltip).toBeNull();
    });

    it('shows the tooltip on focus for keyboard users', () => {
        const wrap: HTMLElement = fixture.nativeElement.querySelector('.zyr-tooltip-wrap');
        wrap.dispatchEvent(new Event('focusin'));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[role="tooltip"]')).not.toBeNull();
    });
});

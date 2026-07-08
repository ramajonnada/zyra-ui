import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraTimeline } from './zyra-timeline';
import { ZyraTimelineItem } from './zyra-timeline-item';

@Component({
    standalone: true,
    imports: [ZyraTimeline, ZyraTimelineItem],
    template: `
        <zyra-timeline>
            <zyra-timeline-item title="Order placed" date="Jan 1" variant="success">
                Your order has been placed.
            </zyra-timeline-item>
            <zyra-timeline-item title="Payment pending" date="Jan 2" variant="warning">
                Waiting for payment confirmation.
            </zyra-timeline-item>
            <zyra-timeline-item title="Order cancelled" date="Jan 3" variant="danger">
                The order was cancelled.
            </zyra-timeline-item>
        </zyra-timeline>
    `,
})
class TimelineHostComponent {}

@Component({
    standalone: true,
    imports: [ZyraTimeline, ZyraTimelineItem],
    template: `
        <zyra-timeline>
            <zyra-timeline-item title="Note">Just a note.</zyra-timeline-item>
        </zyra-timeline>
    `,
})
class TimelineDefaultVariantHostComponent {}

describe('ZyraTimeline', () => {
    let fixture: ComponentFixture<TimelineHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimelineHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(TimelineHostComponent);
        fixture.detectChanges();
    });

    // ── Structure ─────────────────────────────────────────────────────────
    it('renders the timeline wrapper', () => {
        expect(fixture.nativeElement.querySelector('.zyr-timeline')).not.toBeNull();
    });

    it('renders an item per zyra-timeline-item', () => {
        expect(fixture.nativeElement.querySelectorAll('.zyr-timeline-item').length).toBe(3);
    });

    // ── Content ───────────────────────────────────────────────────────────
    it('renders each item title and date', () => {
        const titles: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-timeline-item__title');
        const dates: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-timeline-item__date');
        expect(titles[0].textContent).toContain('Order placed');
        expect(dates[0].textContent).toContain('Jan 1');
        expect(titles[2].textContent).toContain('Order cancelled');
    });

    it('renders projected body content', () => {
        const bodies: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-timeline-item__body');
        expect(bodies[1].textContent).toContain('Waiting for payment confirmation.');
    });

    // ── Variant ───────────────────────────────────────────────────────────
    it('applies the variant class to each dot marker', () => {
        const dots: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-timeline-item__dot');
        expect(dots[0].classList).toContain('zyr-timeline-item__dot--success');
        expect(dots[1].classList).toContain('zyr-timeline-item__dot--warning');
        expect(dots[2].classList).toContain('zyr-timeline-item__dot--danger');
    });

    // ── Last item connector ───────────────────────────────────────────────
    it('hides the connector line on the last item via :host:last-child', () => {
        const items: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('zyra-timeline-item');
        expect(items[items.length - 1]).toBe(
            items[items.length - 1].parentElement!.lastElementChild as HTMLElement,
        );
    });
});

describe('ZyraTimelineItem — default variant', () => {
    let fixture: ComponentFixture<TimelineDefaultVariantHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimelineDefaultVariantHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(TimelineDefaultVariantHostComponent);
        fixture.detectChanges();
    });

    it('applies the default variant class when not specified', () => {
        const dot: HTMLElement = fixture.nativeElement.querySelector('.zyr-timeline-item__dot');
        expect(dot.classList).toContain('zyr-timeline-item__dot--default');
    });
});

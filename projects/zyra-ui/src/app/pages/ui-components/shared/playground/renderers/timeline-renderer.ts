import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraTimeline, ZyraTimelineItem } from 'zyra-ng-ui';

@Component({
    selector: 'pg-timeline-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraTimeline, ZyraTimelineItem],
    styles: [':host { display: block; width: 100%; max-width: 420px; }'],
    template: `
        <zyra-timeline>
            <zyra-timeline-item title="Order placed" date="Jan 1, 2026" variant="success">
                Your order has been placed successfully.
            </zyra-timeline-item>
            <zyra-timeline-item title="Payment confirmed" date="Jan 2, 2026" variant="info">
                Payment was received and confirmed.
            </zyra-timeline-item>
            @if (showWarning()) {
                <zyra-timeline-item title="Delivery delayed" date="Jan 4, 2026" variant="warning">
                    Shipment is delayed due to weather conditions.
                </zyra-timeline-item>
            }
            <zyra-timeline-item title="Delivered" date="Jan 6, 2026" variant="default">
                Package delivered to the recipient.
            </zyra-timeline-item>
        </zyra-timeline>
    `,
})
export class TimelineRenderer {
    showWarning = input<boolean>(true);
}

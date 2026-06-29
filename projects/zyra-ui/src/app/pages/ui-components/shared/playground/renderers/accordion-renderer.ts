import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraAccordion, ZyraAccordionItem } from 'zyra-ng-ui';

@Component({
    selector: 'pg-accordion-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraAccordion, ZyraAccordionItem],
    styles: [':host { display: block; width: 100%; max-width: 520px; }'],
    template: `
        <zyra-accordion [allowMultiple]="allowMultiple()">
            <zyra-accordion-item title="What is Zyra UI?">
                Zyra UI is a modern Angular component library built with signals.
            </zyra-accordion-item>
            <zyra-accordion-item title="Is it free?">
                Yes, fully open source under the MIT licence.
            </zyra-accordion-item>
            <zyra-accordion-item title="Does it support SSR?">
                Absolutely — it ships with full Angular SSR support out of the box.
            </zyra-accordion-item>
        </zyra-accordion>
    `,
})
export class AccordionRenderer {
    allowMultiple = input<boolean>(false);
}

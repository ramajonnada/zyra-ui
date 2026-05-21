import { Component, computed, signal } from '@angular/core';
import { ZyraAccordion, ZyraAccordionItem, ZyraButton, ZyraCard } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-accordion',
    standalone: true,
    imports: [ZyraAccordion, ZyraAccordionItem, ZyraButton, ZyraCard, Controls],
    templateUrl: './accordion.html',
    styleUrl: './accordion.scss',
})
export class Accordion {
    allowMultiple = signal(false);
    copied = signal(false);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'toggle',
            key: 'allowMultiple',
            label: 'boolean inputs',
            toggleLabel: 'allowMultiple',
            signal: this.allowMultiple,
        },
    ];

    generatedCode = computed(() => {
        const lines: string[] = ['<zyra-accordion'];
        if (this.allowMultiple()) lines.push('  [allowMultiple]="true"');
        lines.push('>');
        lines.push('  <zyra-accordion-item title="What is Zyra UI?">');
        lines.push('    Zyra UI is a modern Angular component library.');
        lines.push('  </zyra-accordion-item>');
        lines.push('  <zyra-accordion-item title="Is it free?">');
        lines.push('    Yes, fully open source under MIT.');
        lines.push('  </zyra-accordion-item>');
        lines.push('</zyra-accordion>');
        return lines.join('\n');
    });

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.allowMultiple.set(false);
    }
}

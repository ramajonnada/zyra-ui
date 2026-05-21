import { Component, computed, signal } from '@angular/core';
import { ModalSize, ZyraAlert, ZyraButton, ZyraCard, ZyraModal } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [ZyraModal, ZyraButton, ZyraCard, ZyraAlert, Controls],
    templateUrl: './modal.html',
    styleUrl: './modal.scss',
})
export class Modal {
    open = signal(false);
    size = signal<ModalSize>('md');
    title = signal('Confirm action');
    dismissible = signal(true);
    copied = signal(false);

    // real world example modals
    deleteModal = signal(false);
    infoModal = signal(false);
    forcedModal = signal(false);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['sm', 'md', 'lg', 'xl'],
            signal: this.size as ReturnType<typeof signal<string>>,
        },
        {
            type: 'text',
            key: 'title',
            label: 'title',
            placeholder: 'Modal title...',
            signal: this.title,
        },
        {
            type: 'toggle',
            key: 'dismissible',
            label: 'boolean inputs',
            toggleLabel: 'dismissible',
            signal: this.dismissible,
        },
    ];

    generatedCode = computed(() => {
        const attrs: string[] = [];
        if (this.size() !== 'md') attrs.push(`  size="${this.size()}"`);
        if (this.title()) attrs.push(`  title="${this.title()}"`);
        if (!this.dismissible()) attrs.push(`  [dismissible]="false"`);

        const lines = [`<zyra-modal`, `  [(open)]="isOpen"`, ...attrs, `>`];
        lines.push(`  <p>Modal body content goes here.</p>`);
        lines.push(`  <div slot="footer" class="zyr-modal__footer">`);
        lines.push(`    <zyra-button variant="ghost" (clicked)="isOpen.set(false)">Cancel</zyra-button>`);
        lines.push(`    <zyra-button variant="primary" (clicked)="confirm()">Confirm</zyra-button>`);
        lines.push(`  </div>`);
        lines.push(`</zyra-modal>`);
        return lines.join('\n');
    });

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.open.set(false);
        this.size.set('md');
        this.title.set('Confirm action');
        this.dismissible.set(true);
    }
}

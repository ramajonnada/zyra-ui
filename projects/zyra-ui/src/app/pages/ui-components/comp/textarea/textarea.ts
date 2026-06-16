import { Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ZyraFormField, ZyraTextarea, ZyraButton, TextareaSize, TextareaResize } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, ZyraTextarea, ZyraFormField, ZyraButton, Controls],
    templateUrl: './textarea.html',
    styleUrl: './textarea.scss',
})
export class Textarea {
    size        = signal<TextareaSize>('md');
    resize      = signal<TextareaResize>('vertical');
    rows        = signal(3);
    placeholder = signal('Enter your message...');
    playValue   = signal('');
    copied      = signal(false);

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['sm', 'md', 'lg'],
            signal: this.size as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'resize',
            label: 'resize',
            options: ['none', 'vertical', 'auto'],
            signal: this.resize as ReturnType<typeof signal<string>>,
        },
    ];

    generatedCode = computed(() => {
        const attrs: string[] = [];
        if (this.size() !== 'md') attrs.push(`  size="${this.size()}"`);
        if (this.resize() !== 'vertical') attrs.push(`  resize="${this.resize()}"`);
        if (this.rows() !== 3) attrs.push(`  [rows]="${this.rows()}"`);
        if (this.placeholder() !== 'Enter your message...') attrs.push(`  placeholder="${this.placeholder()}"`);

        return attrs.length === 0
            ? `<zyra-form-field label="Message">\n  <zyra-textarea />\n</zyra-form-field>`
            : [`<zyra-form-field label="Message">`, `  <zyra-textarea`, ...attrs, `  />`, `</zyra-form-field>`].join('\n');
    });

    bioCtrl = new FormControl('', [Validators.maxLength(200)]);

    copy(): void {
        navigator.clipboard.writeText(this.generatedCode()).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }

    reset(): void {
        this.size.set('md');
        this.resize.set('vertical');
        this.rows.set(3);
        this.playValue.set('');
    }
}

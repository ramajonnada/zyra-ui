import { Component, computed, signal } from '@angular/core';
import { AlertVariant, ZyraAlert, ZyraButton } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
	selector: 'app-alert',
	standalone: true,
	imports: [ZyraAlert, ZyraButton, Controls],
	templateUrl: './alert.html',
	styleUrl: './alert.scss',
})
export class Alert {
	variant = signal<AlertVariant>('info');
	title = signal('Heads up');
	dismissible = signal(false);
	visible = signal(true);
	copied = signal(false);

	variants: AlertVariant[] = ['success', 'warning', 'danger', 'info'];

	readonly controlDefs: ControlDef[] = [
		{
			type: 'text',
			key: 'title',
			label: 'title',
			placeholder: 'Alert title...',
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
		if (this.variant() !== 'info') attrs.push(`  variant="${this.variant()}"`);
		if (this.title()) attrs.push(`  title="${this.title()}"`);
		if (this.dismissible()) attrs.push(`  [dismissible]="true"`);

		const tag = attrs.length === 0 ? `<zyra-alert>` : [`<zyra-alert`, ...attrs, `>`].join('\n');
		return `${tag}\n  Your message here.\n</zyra-alert>`;
	});

	copy(): void {
		navigator.clipboard.writeText(this.generatedCode()).then(() => {
			this.copied.set(true);
			setTimeout(() => this.copied.set(false), 2000);
		});
	}

	reset(): void {
		this.variant.set('info');
		this.title.set('Heads up');
		this.dismissible.set(false);
		this.visible.set(true);
	}
}

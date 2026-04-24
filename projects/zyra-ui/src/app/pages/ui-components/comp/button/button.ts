import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraBadge, ZyraButton, ZyraToastService } from 'zyra-ng-ui';

@Component({
	selector: 'app-button',
	standalone: true,
	imports: [FormsModule, ZyraButton, ZyraBadge],
	templateUrl: './button.html',
	styleUrl: './button.scss',
})
export class Button {
	toastService = inject(ZyraToastService);

	selectedVariant = signal<'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'>('primary');
	selectedSize = signal<'sm' | 'md' | 'lg'>('md');
	isLoading = signal(false);
	isDisabled = signal(false);
	isFullWidth = signal(false);
	iconLeft = signal('');
	iconRight = signal('');
	buttonLabel = 'Button';

	variants = ['primary', 'secondary', 'ghost', 'outline', 'danger'] as const;
	sizes = ['sm', 'md', 'lg'] as const;

	log(msg: string): void {
		this.toastService.info(msg);
	}

	copyCode(): void {
		const code = this.generatedCode();
		navigator.clipboard.writeText(code);
		this.toastService.success('Code copied to clipboard!');
	}

	generatedCode = computed(() => {
		let code = `<zyra-button variant="${this.selectedVariant()}" size="${this.selectedSize()}"`;
		if (this.isLoading()) code += ` [loading]="true"`;
		if (this.isDisabled()) code += ` [disabled]="true"`;
		if (this.isFullWidth()) code += ` [fullWidth]="true"`;
		code += `>`;
		if (this.iconLeft()) code += `\n  <i slot="prefix" class="${this.iconLeft()}"></i>`;
		code += `\n  ${this.buttonLabel || 'Button'}`;
		if (this.iconRight()) code += `\n  <i slot="suffix" class="${this.iconRight()}"></i>`;
		code += `\n</zyra-button>`;
		return code;
	});
}

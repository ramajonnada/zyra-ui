import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZyraButton, ZyraBadge, ZyraThemeService, ZyraToastContainer, ZyraToastService } from 'zyra-ng-ui';

@Component({
	selector: 'app-button',
	standalone: true,
	imports: [FormsModule, ZyraButton, ZyraBadge],
	templateUrl: './button.html',
	styleUrl: './button.scss',
})
export class Button {
	toastService = inject(ZyraToastService);

	// ── State ─────────────────────────────────────────────────
	selectedVariant = signal<'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'>('primary');
	selectedSize = signal<'sm' | 'md' | 'lg'>('md');
	isLoading = signal(false);
	isDisabled = signal(false);
	isFullWidth = signal(false);
	iconLeft = signal('');
	iconRight = signal('');
	buttonLabel = 'Button';

	// ── Data for combo table ──────────────────────────────────
	variants = ['primary', 'secondary', 'ghost', 'outline', 'danger'] as const;
	sizes = ['sm', 'md', 'lg'] as const;

	// ── Methods ───────────────────────────────────────────────
	log(msg: string): void {
		this.toastService.info(msg);
	}

	copyCode(): void {
		const code = `<zyra-button variant="${this.selectedVariant()}" size="${this.selectedSize()}"${this.isLoading() ? ' [loading]="true"' : ''}${this.isDisabled() ? ' [disabled]="true"' : ''}${this.isFullWidth() ? ' [fullWidth]="true"' : ''}${this.iconLeft() ? ` iconLeft="${this.iconLeft()}"` : ''}${this.iconRight() ? ` iconRight="${this.iconRight()}"` : ''}>${this.buttonLabel}</zyra-button>`;
		navigator.clipboard.writeText(code);
		this.toastService.success('Code copied to clipboard!');
	}

	generatedCode = computed(() => {
		return `<zyra-button variant="${this.selectedVariant()}" size="${this.selectedSize()}"${this.isLoading() ? ' [loading]="true"' : ''}${this.isDisabled() ? ' [disabled]="true"' : ''}${this.isFullWidth() ? ' [fullWidth]="true"' : ''}${this.iconLeft() ? ` iconLeft="${this.iconLeft()}"` : ''}${this.iconRight() ? ` iconRight="${this.iconRight()}"` : ''}>${this.buttonLabel}</zyra-button>`;
	});
}

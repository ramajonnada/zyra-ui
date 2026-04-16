import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	BadgeSize,
	BadgeVariant,
	ZyraBadge,
	ZyraThemeService,
	ZyraToastContainer,
	ZyraToastService,
} from 'zyra-ng-ui';

@Component({
	selector: 'app-badge',
	standalone: true,
	imports: [
		FormsModule,
		ZyraBadge,
		ZyraToastContainer,
	],
	templateUrl: './badge.html',
	styleUrl: './badge.scss',
}) export class Badge {
	themeService = inject(ZyraThemeService);
	toastService = inject(ZyraToastService);

	// ── Controls ──────────────────────────────────────────────
	variant = signal<BadgeVariant>('success');
	size = signal<BadgeSize>('md');
	dot = signal(false);
	labelText = 'Badge';

	// ── UI state ──────────────────────────────────────────────
	copied = signal(false);

	// ── Options ───────────────────────────────────────────────
	variants: BadgeVariant[] = ['success', 'warning', 'danger', 'info', 'purple', 'default'];
	sizes: BadgeSize[] = ['sm', 'md', 'lg'];

	// ── Generated code ────────────────────────────────────────
	generatedCode = computed(() => {
		const lines: string[] = ['<zyr-badge'];
		if (this.variant() !== 'default') lines.push(`  variant="${this.variant()}"`);
		if (this.size() !== 'md') lines.push(`  size="${this.size()}"`);
		if (this.dot()) lines.push(`  [dot]="true"`);
		lines.push(`>`);
		lines.push(`  ${this.labelText}`);
		lines.push(`</zyr-badge>`);
		return lines.join('\n');
	});

	// ── Methods ───────────────────────────────────────────────
	copy(): void {
		navigator.clipboard.writeText(this.generatedCode()).then(() => {
			this.copied.set(true);
			setTimeout(() => this.copied.set(false), 2000);
		});
	}

	reset(): void {
		this.variant.set('success');
		this.size.set('md');
		this.dot.set(false);
		this.labelText = 'Badge';
	}
}

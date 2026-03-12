import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardPadding, CardVariant, ZyraAvatar, ZyraBadge, ZyraButton, ZyraCard, ZyraThemeService, ZyraToastContainer, ZyraToastService } from 'zyra-ng-ui';

@Component({
	selector: 'app-card-test',
	imports: [
		FormsModule,
		ZyraCard,
		ZyraButton,
		ZyraBadge,
		ZyraAvatar,
		ZyraToastContainer,
		TitleCasePipe],
	templateUrl: './card-test.html',
	styleUrl: './card-test.scss',
})
export class CardTest {
	themeService = inject(ZyraThemeService);
	toastService = inject(ZyraToastService);

	// ── Controls ──────────────────────────────────────────────
	variant = signal<CardVariant>('default');
	padding = signal<CardPadding>('md');
	hasHeader = signal(false);
	hasFooter = signal(false);
	clickable = signal(false);
	preset = signal('Simple text');

	// ── UI state ──────────────────────────────────────────────
	copied = signal(false);
	eventLog = signal<{ time: string; msg: string }[]>([]);

	// ── Options ───────────────────────────────────────────────
	variants:CardVariant[] = ['default', 'outlined', 'elevated', 'ghost'];
	paddings:CardPadding[] = ['none', 'sm', 'md', 'lg'];

	presets = [
		{
			label: 'Simple text',
			html: `<p style="font-size:13px;color:var(--zyr-text-muted);margin:0;line-height:1.6">
        This is a simple card body with just text content inside it.
      </p>`,
		},
		{
			label: 'With image',
			html: `<div style="background:var(--zyr-accent-muted);border-radius:var(--zyr-radius-sm);height:100px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;font-size:28px">🖼️</div>
      <p style="font-size:13px;color:var(--zyr-text-muted);margin:0">Card with an image placeholder above the description text.</p>`,
		},
		{
			label: 'With stats',
			html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="background:var(--zyr-bg-3);border-radius:var(--zyr-radius-sm);padding:12px;border:1px solid var(--zyr-border)">
          <div style="font-size:20px;font-weight:800;color:var(--zyr-text);font-family:var(--zyr-font-display)">2.4k</div>
          <div style="font-size:11px;color:var(--zyr-text-muted);margin-top:2px">Total Users</div>
        </div>
        <div style="background:var(--zyr-bg-3);border-radius:var(--zyr-radius-sm);padding:12px;border:1px solid var(--zyr-border)">
          <div style="font-size:20px;font-weight:800;color:var(--zyr-accent);font-family:var(--zyr-font-display)">98%</div>
          <div style="font-size:11px;color:var(--zyr-text-muted);margin-top:2px">Uptime</div>
        </div>
      </div>`,
		},
		{
			label: 'Empty (no padding)',
			html: `<div style="height:60px;display:flex;align-items:center;justify-content:center;color:var(--zyr-text-dim);font-size:13px;font-family:var(--zyr-font-mono)">Empty card body</div>`,
		},
	];

	currentPreset = computed(() =>
		this.presets.find(p => p.label === this.preset()) ?? this.presets[0]
	);

	// ── Generated code ────────────────────────────────────────
	generatedCode = computed(() => {
		const lines: string[] = ['<zyr-card'];

		if (this.variant() !== 'default') lines.push(`  variant="${this.variant()}"`);
		if (this.padding() !== 'md') lines.push(`  padding="${this.padding()}"`);
		if (this.hasHeader()) lines.push(`  [hasHeader]="true"`);
		if (this.hasFooter()) lines.push(`  [hasFooter]="true"`);
		if (this.clickable()) lines.push(`  [clickable]="true"`);
		if (this.clickable()) lines.push(`  (cardClick)="onCardClick()"`);

		lines.push(`>`);

		if (this.hasHeader()) {
			lines.push(`  <div slot="header">`);
			lines.push(`    <!-- header content -->`);
			lines.push(`  </div>`);
		}

		lines.push(`  <!-- body content -->`);

		if (this.hasFooter()) {
			lines.push(`  <div slot="footer">`);
			lines.push(`    <!-- footer content -->`);
			lines.push(`  </div>`);
		}

		lines.push(`</zyr-card>`);
		return lines.join('\n');
	});

	// ── Methods ───────────────────────────────────────────────
	onCardClick(): void {
		this.log('(cardClick) output fired!');
		this.toastService.info('Card clicked!');
	}

	log(msg: string): void {
		const time = new Date().toLocaleTimeString();
		this.eventLog.update(log => [{ time, msg }, ...log].slice(0, 10));
	}

	copy(): void {
		navigator.clipboard.writeText(this.generatedCode()).then(() => {
			this.copied.set(true);
			setTimeout(() => this.copied.set(false), 2000);
		});
	}

	reset(): void {
		this.variant.set('default');
		this.padding.set('md');
		this.hasHeader.set(false);
		this.hasFooter.set(false);
		this.clickable.set(false);
		this.preset.set('Simple text');
		this.eventLog.set([]);
	}
}

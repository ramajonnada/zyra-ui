// projects/zyra-ui/src/app/pages/test/toast/toast.ts

import { Component, inject, signal } from '@angular/core';
import {
	ZyraButton,
	ZyraBadge,
	ZyraCard,
	ZyraTooltip,
	ZyraToastContainer,
	ZyraToastService,
	ZyraThemeService,
	ToastVariant,
} from 'zyra-ng-ui';

@Component({
	selector: 'app-toast',
	standalone: true,
	templateUrl: './toast.html',
	styleUrl: './toast.scss',
	imports: [
		ZyraButton,
		ZyraBadge,
		ZyraCard,
		ZyraToastContainer,
	],
})
export class Toast {
	themeService = inject(ZyraThemeService);
	toastService = inject(ZyraToastService);

	// ── Playground controls ───────────────────────────────────
	variant = signal<ToastVariant>('success');
	title = signal('Operation completed');
	description = signal('Your changes have been saved.');
	duration = signal(4000);
	persistent = signal(false);

	variants: ToastVariant[] = ['success', 'error', 'warning', 'info', 'default'];
	durations = [2000, 4000, 6000, 8000];

	fire(): void {
		const opts = {
			description: this.description(),
			duration: this.persistent() ? 0 : this.duration(),
		};
		switch (this.variant()) {
			case 'success': this.toastService.success(this.title(), opts); break;
			case 'error': this.toastService.error(this.title(), opts); break;
			case 'warning': this.toastService.warning(this.title(), opts); break;
			case 'info': this.toastService.info(this.title(), opts); break;
			default: this.toastService.info(this.title(), opts); break;
		}
	}

	dismissAll(): void {
		this.toastService.dismissAll();
	}

	reset(): void {
		this.variant.set('success');
		this.title.set('Operation completed');
		this.description.set('Your changes have been saved.');
		this.duration.set(4000);
		this.persistent.set(false);
	}

	// ── Scenario demos ────────────────────────────────────────
	demoFormSave(): void {
		this.toastService.success('Profile saved!', { description: 'Your profile info has been updated.' });
	}

	demoNetworkError(): void {
		this.toastService.error('Connection failed', { description: 'Check your internet connection and try again.', duration: 6000 });
	}

	demoSessionWarning(): void {
		this.toastService.warning('Session expiring', { description: 'You will be logged out in 5 minutes.', duration: 8000 });
	}

	demoNewMessage(): void {
		this.toastService.info('New message from Priya', { description: 'Hey, can you review the latest PR?' });
	}

	demoMultiple(): void {
		this.toastService.success('File uploaded');
		setTimeout(() => this.toastService.info('Processing started…'), 400);
		setTimeout(() => this.toastService.success('Done! File is ready.'), 1800);
	}

	demoPersistent(): void {
		this.toastService.warning('Unsaved changes', { description: 'You have unsaved changes. Save before leaving.', duration: 0 });
	}
}
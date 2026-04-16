// projects/zyra-ui/src/app/pages/test/avatar/avatar.ts

import { Component, inject, signal } from '@angular/core';
import {
	ZyraAvatar,
	ZyraButton,
	ZyraBadge,
	ZyraCard,
	ZyraTooltip,
	ZyraToastContainer,
	ZyraToastService,
	ZyraThemeService,
	AvatarSize,
	AvatarVariant,
} from 'zyra-ng-ui';

@Component({
	selector: 'app-avatar',
	standalone: true,
	templateUrl: './avatar.html',
	styleUrl: './avatar.scss',
	imports: [
		ZyraAvatar,
		ZyraButton,
		ZyraBadge,
		ZyraCard,
		ZyraTooltip,
		ZyraToastContainer,
	],
})
export class Avatar {
	themeService = inject(ZyraThemeService);
	toastService = inject(ZyraToastService);

	// ── Playground controls ───────────────────────────────────
	size = signal<AvatarSize>('md');
	variant = signal<AvatarVariant>('teal');
	online = signal<boolean | null>(null);
	square = signal(false);
	name = signal('Arjun Kumar');
	src = signal('');

	sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
	variants: AvatarVariant[] = ['teal', 'blue', 'purple', 'warm', 'neutral'];
	onlineOptions = [
		{ label: 'none', value: null },
		{ label: 'online', value: true },
		{ label: 'offline', value: false },
	];

	sampleNames = [
		'Arjun Kumar', 'Priya Sharma', 'Rohit Verma',
		'Sneha Patel', 'Dev Zyra', 'A',
	];

	sampleImages = [
		'https://i.pravatar.cc/150?img=1',
		'https://i.pravatar.cc/150?img=2',
		'https://i.pravatar.cc/150?img=3',
		'broken-url.jpg',   // intentionally broken to show fallback
	];

	reset(): void {
		this.size.set('md');
		this.variant.set('teal');
		this.online.set(null);
		this.square.set(false);
		this.name.set('Arjun Kumar');
		this.src.set('');
	}

	onAvatarClick(name: string): void {
		this.toastService.info(`Clicked: ${name}`);
	}
}
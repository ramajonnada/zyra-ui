import { Component, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FormsModule } from '@angular/forms';
import {
	ToastVariant,
	ZyraAvatar,
	ZyraBadge,
	ZyraButton,
	ZyraCard,
	ZyraFormField,
	ZyraInput,
	ZyraSpinner,
	ZyraToastService,
} from 'zyra-ng-ui';
import { appIcons } from '../../shared/fontawesome-icons';
import { Meta, Title } from '@angular/platform-browser';

interface ProofStat {
	value: string;
	label: string;
	icon: IconDefinition;
	iconClass: string;
}

interface FeatureCard {
	title: string;
	description: string;
	icon: IconDefinition;
	iconClass: string;
}

export interface InstallStep {
	step: string;
	title: string;
	description: string;
	code: string;
}

interface ComparisonRow {
	feature: string;
	zyra: string;
	other: string;
	otherTone: 'warning' | 'danger';
}

interface OpenSourceStat {
	title: string;
	description: string;
	icon: IconDefinition;
	iconClass: string;
}

@Component({
	selector: 'app-home',
	imports: [
		FormsModule,
		ZyraAvatar,
		ZyraBadge,
		ZyraButton,
		ZyraCard,
		ZyraFormField,
		ZyraInput,
		ZyraSpinner,
		FaIconComponent,
	],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	private readonly toast = inject(ZyraToastService);

	readonly installCommand = 'npm install zyra-ng-ui';
	readonly copied = signal(false);
	readonly icons = appIcons;

	demoEmail = 'hello@zyraui.dev';
	demoPassword = 'signals-only';

	readonly heroMetrics = ['9 core components', '100% standalone', 'Angular 21+', 'MIT licensed'];

	readonly proofStats: ProofStat[] = [
		{
			value: '9',
			label: 'Core components',
			icon: appIcons.cubes,
			iconClass: 'proof-stat__icon proof-stat__icon--teal',
		},
		{
			value: '100%',
			label: 'Standalone-first',
			icon: appIcons.bolt,
			iconClass: 'proof-stat__icon proof-stat__icon--blue',
		},
		{
			value: '3',
			label: 'Accent token families',
			icon: appIcons.palette,
			iconClass: 'proof-stat__icon proof-stat__icon--purple',
		},
	];

	readonly features: FeatureCard[] = [
		{
			title: 'Signal-based architecture',
			description:
				'Components lean into Angular signals with modern input and output patterns so state stays granular and predictable.',
			icon: appIcons.waveSquare,
			iconClass: 'feature-card__icon feature-card__icon--teal',
		},
		{
			title: 'Token-driven theming',
			description:
				'The full --zyr-* token system gives you dark and light foundations plus enough semantic color hooks for product-level polish.',
			icon: appIcons.swatchbook,
			iconClass: 'feature-card__icon feature-card__icon--blue',
		},
		{
			title: 'Accessible by default',
			description:
				'Keyboard behavior, focus visibility, and sensible states are already built into the primitives instead of added later.',
			icon: appIcons.universalAccess,
			iconClass: 'feature-card__icon feature-card__icon--green',
		},
		{
			title: 'Tree-shakeable package',
			description:
				'Import only what you use. The library stays lightweight and works naturally with standalone Angular applications.',
			icon: appIcons.boxOpen,
			iconClass: 'feature-card__icon feature-card__icon--purple',
		},
		{
			title: 'CVA-ready forms',
			description:
				'Inputs and form fields are set up for real Angular forms, with a cleaner ControlValueAccessor story and easier validation states.',
			icon: appIcons.puzzlePiece,
			iconClass: 'feature-card__icon feature-card__icon--yellow',
		},
		{
			title: 'Dark-first visual language',
			description:
				'The foundation already matches the library token set, so the marketing site can feel premium without drifting away from product UI.',
			icon: appIcons.moon,
			iconClass: 'feature-card__icon feature-card__icon--teal',
		},
	];

	readonly codeChecks = [
		'Typed APIs designed for Angular-first DX',
		'Standalone components with minimal setup',
		'Theme provider integration via provideZyra()',
		'CVA-friendly form primitives',
		'Signal-based state patterns throughout',
	];

	readonly installSteps: InstallStep[] = [
		{
			step: '1',
			title: 'Install the package',
			description:
				'Add Zyra NG UI to your Angular 21+ workspace with your package manager of choice.',
			code: '# npm\nnpm install zyra-ng-ui\n\n# pnpm\npnpm add zyra-ng-ui',
		},
		{
			step: '2',
			title: 'Register the provider',
			description:
				'Enable the theme service once at bootstrap so tokens and runtime theme switching are ready immediately.',
			code: "import { provideZyra } from 'zyra-ng-ui';\n\nproviders: [\n  provideZyra({ theme: 'dark' })\n]",
		},
		{
			step: '3',
			title: 'Start building',
			description:
				'Pull in any standalone component and use it directly in your feature templates.',
			code: "import { ZyraButton } from 'zyra-ng-ui';\n\n@Component({\n  imports: [ZyraButton],\n})",
		},
	];

	readonly comparisonRows: ComparisonRow[] = [
		{
			feature: 'Signal-native APIs',
			zyra: 'Modern component state patterns already baked in',
			other: 'Older decorator-era APIs are still common',
			otherTone: 'warning',
		},
		{
			feature: 'Standalone component setup',
			zyra: 'Designed around standalone imports from the start',
			other: 'Mixed patterns often need extra migration work',
			otherTone: 'warning',
		},
		{
			feature: 'Design token coverage',
			zyra: 'Shared CSS tokens keep app UI and marketing UI aligned',
			other: 'Token depth can vary or require custom layering',
			otherTone: 'danger',
		},
		{
			feature: 'Form-field ergonomics',
			zyra: 'CVA-ready primitives fit normal Angular form flows',
			other: 'Form support can be heavier or less cohesive',
			otherTone: 'warning',
		},
		{
			feature: 'Dark-first polish',
			zyra: 'The library visual language already starts from dark mode',
			other: 'Many systems still treat dark mode as a follow-up pass',
			otherTone: 'warning',
		},
	];

	readonly openSourceStats: OpenSourceStat[] = [
		{
			title: 'MIT licensed',
			description: 'Friendly for commercial and personal work.',
			icon: appIcons.scaleBalanced,
			iconClass: 'oss-stat__icon oss-stat__icon--teal',
		},
		{
			title: 'Active development',
			description: 'The component set is evolving with the docs site.',
			icon: appIcons.hammer,
			iconClass: 'oss-stat__icon oss-stat__icon--blue',
		},
		{
			title: 'Token aligned',
			description: 'Website polish and library primitives share the same foundation.',
			icon: appIcons.droplet,
			iconClass: 'oss-stat__icon oss-stat__icon--purple',
		},
		{
			title: 'Built for Angular 21+',
			description: 'Optimized for current Angular app architecture.',
			icon: appIcons.codeBranch,
			iconClass: 'oss-stat__icon oss-stat__icon--green',
		},
	];

	constructor(private title: Title, private meta: Meta) { }

	ngOnInit() {
		this.title.setTitle('Zyrang UI - Modern Angular UI Library');

		this.meta.updateTag({
			name: 'description',
			content: 'Build fast Angular apps with Zyrang UI components.'
		});

		this.meta.updateTag({
			property: 'og:title',
			content: 'Zyrang UI'
		});

		this.meta.updateTag({
			property: 'og:url',
			content: 'https://www.zyraui.dev/'
		});
	}

	scrollToSection(id: string) {
		if (typeof document === 'undefined') return;

		document.getElementById(id)?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}

	async copyInstallCommand() {
		try {
			if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(this.installCommand);
			}

			this.copied.set(true);
			this.toast.success('Install command copied', {
				description: this.installCommand,
				duration: 2200,
			});

			setTimeout(() => this.copied.set(false), 2200);
		} catch {
			this.toast.info('Copy is unavailable in this browser', {
				description: this.installCommand,
				duration: 2600,
			});
		}
	}

	showToast(variant: ToastVariant) {
		switch (variant) {
			case 'success':
				this.toast.success('Saved successfully', {
					description: 'Zyra toast styles are active in the live page.',
				});
				break;
			case 'warning':
				this.toast.warning('Heads up', {
					description: 'Theme and token changes can be previewed instantly.',
				});
				break;
			case 'error':
				this.toast.error('Upload failed', {
					description: 'Demo toast component styles are wired and ready.',
				});
				break;
			case 'info':
			default:
				this.toast.info('New release available', {
					description: 'Version 1.3.24 is ready to install.',
				});
		}
	}



}

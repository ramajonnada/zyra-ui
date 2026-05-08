import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { RouterLink } from '@angular/router';
import { ZyraAvatar, ZyraBadge, ZyraButton, ZyraCard, ZyraFormField, ZyraInput, ZyraToastService } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { appIcons } from '../../shared/fontawesome-icons';

type AvatarVariant = 'teal' | 'blue' | 'purple' | 'warm' | 'neutral';
type FeatureTone = 'accent' | 'blue' | 'purple' | 'green' | 'warning' | 'neutral';
type MetricTone = 'accent' | 'blue' | 'warning';
type SystemTone = 'accent' | 'blue' | 'purple';

interface IconCard {
	title: string;
	description: string;
	icon: IconDefinition;
	tone: FeatureTone;
}

interface MetricBar {
	label: string;
	value: string;
	width: string;
	tone: MetricTone;
}

interface SystemCard {
	title: string;
	description: string;
	icon: IconDefinition;
	tone: SystemTone;
	points: readonly string[];
}

interface Testimonial {
	quote: string;
	author: string;
	role: string;
	avatarVariant?: AvatarVariant;
}

export interface InstallStep {
	step: string;
	title: string;
	description: string;
	code: string;
}

const COPY_RESET_DELAY = 2200;
const WAITLIST_PLACEHOLDER = 'your@company.dev';
const INSTALL_COMMAND = 'npm install zyra-ng-ui';
const RATING_MARKS = [1, 2, 3, 4, 5] as const;

const HERO_META = [
	'Open source',
	'MIT Licensed',
	'TypeScript ready',
	'Angular 21+',
] as const;


const DEVELOPER_CHECKS = [
	'Framework-agnostic: Next.js, Remix, Vite, Astro',
	'100% ownership – copy the code, tweak forever',
	'CSS variables for effortless theming',
	'A11y-first – tested with ARIA + VoiceOver',
] as const;

const SYSTEM_CARDS: readonly SystemCard[] = [
	{
		title: 'Typography from tokens',
		description:
			'Display, body, and mono families stay consistent because the website reads directly from the same library font roles.',
		icon: appIcons.swatchbook,
		tone: 'accent',
		points: [
			'Hero headlines use the display family',
			'Body copy stays legible at every breakpoint',
			'Meta labels and commands use the mono role',
		],
	},
	{
		title: 'Semantic surfaces',
		description:
			'Backgrounds, borders, glows, and cards are layered from semantic tokens instead of hard-coded colors.',
		icon: appIcons.palette,
		tone: 'blue',
		points: [
			'Accent glow comes from shared brand tokens',
			'Surface elevation matches component previews',
			'Hover and focus states inherit the same system values',
		],
	},
	{
		title: 'Responsive rhythm',
		description:
			'Spacing, grids, and content density scale down cleanly so the site still feels intentional on phones.',
		icon: appIcons.cubes,
		tone: 'purple',
		points: [
			'Hero shifts from two columns to one story flow',
			'Feature cards collapse without awkward gaps',
			'Navigation and CTAs stay accessible on touch devices',
		],
	},
] as const;

const FEATURE_CARDS: readonly IconCard[] = [
	{
		title: 'Accessible',
		description:
			'WCAG 2.0 AA compliant. Keyboard nav, focus rings, and screen-reader labels baked in.',
		icon: appIcons.universalAccess,
		tone: 'accent',
	},
	{
		title: 'Themeable',
		description:
			'CSS variables + token-defined colors. Re-skin the entire library with a single token file.',
		icon: appIcons.palette,
		tone: 'purple',
	},
	{
		title: 'Framework-agnostic',
		description:
			'Works with Angular standalone, signals, SSR, and Vite. No bundler magic required.',
		icon: appIcons.codeBranch,
		tone: 'blue',
	},
	{
		title: 'Tree-shakeable',
		description: 'Tiny per-component footprint. Average button ships under 2kb gzip.',
		icon: appIcons.boxOpen,
		tone: 'green',
	},
	{
		title: 'Dark-mode first',
		description:
			'Designed in the dark, perfected in the light. Auto-switch based on OS preference.',
		icon: appIcons.moon,
		tone: 'neutral',
	},
	{
		title: 'Smooth animations',
		description:
			'Hand-crafted easings for hover, press, enter, and scroll. Never janky.',
		icon: appIcons.waveSquare,
		tone: 'warning',
	},
] as const;

const METRICS: readonly MetricBar[] = [
	{ label: 'Build', value: '93%', width: '93%', tone: 'accent' },
	{ label: 'Coverage', value: '94%', width: '94%', tone: 'blue' },
	{ label: 'Bundle', value: '32.4kb', width: '72%', tone: 'warning' },
] as const;

const INSTALL_STEPS: readonly InstallStep[] = [
	{
		step: '01',
		title: 'Set the font roles',
		description:
			'Load the library families once so every component and section reads the same typography tokens.',
		code: '--zyr-font-display / --zyr-font-body / --zyr-font-mono',
	},
	{
		step: '02',
		title: 'Compose with surfaces',
		description:
			'Build the hero, stats, cards, and CTA from semantic background and border tokens instead of isolated custom colors.',
		code: 'var(--zyr-bg-2) + var(--zyr-border) + var(--zyr-accent)',
	},
	{
		step: '03',
		title: 'Collapse gracefully',
		description:
			'Let the layout tighten through grid changes, not hidden content, so mobile still feels like the full experience.',
		code: 'desktop -> tablet -> mobile',
	},
] as const;

const TESTIMONIALS: readonly Testimonial[] = [
	{
		quote: "ZyraUI is the first library that doesn't make my designer cry. We rebuilt our entire dashboard in two days.",
		author: 'Maya Chen',
		role: 'Staff engineer, Superhuman',
	},
	{
		quote: "The motion system alone is worth it. Every interaction feels considered. It's the Linear of UI libraries.",
		author: 'Dev Patel',
		role: 'Founding eng, @Orbital',
		avatarVariant: 'blue',
	},
	{
		quote: "Finally a dark theme I don't want to tear apart. The neon cyan is tasteful — it whispers instead of shouting.",
		author: 'Ines Müller',
		role: 'Design engineer, Lumen',
		avatarVariant: 'purple',
	},
] as const;

@Component({
	selector: 'app-home',
	imports: [RouterLink, FaIconComponent, ZyraBadge, ZyraButton, ZyraCard, ZyraFormField, ZyraInput],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
	private readonly toast = inject(ZyraToastService);
	private readonly seo = inject(SeoService);
	private copyResetTimer?: ReturnType<typeof setTimeout>;

	readonly installCommand = INSTALL_COMMAND;
	readonly copied = signal(false);
	readonly icons = appIcons;
	readonly ratingMarks = RATING_MARKS;
	readonly waitlistEmail = WAITLIST_PLACEHOLDER;

	readonly heroMeta = HERO_META;
	readonly developerChecks = DEVELOPER_CHECKS;
	readonly systemCards = SYSTEM_CARDS;
	readonly featureCards = FEATURE_CARDS;
	readonly metrics = METRICS;
	readonly installSteps = INSTALL_STEPS;
	readonly testimonials = TESTIMONIALS;

	ngOnInit() {
		this.seo.setSEO({
			title: 'Zyra UI - Angular components with tokens and polished DX',
			description:
				'Build premium Angular interfaces with Zyra UI. Token-driven components, polished motion, and a dark-first design system.',
			url: 'https://www.zyraui.dev/',
		});
	}

	ngOnDestroy() {
		this.clearCopyResetTimer();
	}

	async copyInstallCommand() {
		try {
			if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
				throw new Error('Clipboard API is unavailable');
			}

			await navigator.clipboard.writeText(this.installCommand);
			this.copied.set(true);
			this.toast.success('Install command copied', {
				description: this.installCommand,
				duration: COPY_RESET_DELAY,
			});

			this.clearCopyResetTimer();
			this.copyResetTimer = setTimeout(() => this.copied.set(false), COPY_RESET_DELAY);
		} catch {
			this.toast.info('Copy is unavailable in this browser', {
				description: this.installCommand,
				duration: 2600,
			});
		}
	}

	private clearCopyResetTimer() {
		if (!this.copyResetTimer) {
			return;
		}

		clearTimeout(this.copyResetTimer);
		this.copyResetTimer = undefined;
	}
}

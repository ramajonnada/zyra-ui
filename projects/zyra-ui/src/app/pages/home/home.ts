import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { RouterLink } from '@angular/router';
import { ZyraBadge, ZyraButton, ZyraCard, ZyraFormField, ZyraInput, ZyraToastService } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { appIcons } from '../../shared/fontawesome-icons';
import { LIBRARY_VERSION } from '../../shared/version';

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

interface BlockStat {
	value: string;
	label: string;
	tone: 'accent' | 'blue' | 'purple';
}

interface TokenSwatch {
	name: string;
	token: string;
	tone: 'accent' | 'blue' | 'purple' | 'success' | 'warning';
}

const COPY_RESET_DELAY = 2200;
const WAITLIST_PLACEHOLDER = 'your@company.dev';
const INSTALL_COMMAND = 'npm install zyra-ng-ui';
const EMPTY_STATE_BLOCK_CODE = `import { Component } from '@angular/core';
import { ZyraButton, ZyraCard } from 'zyra-ng-ui';

@Component({
  selector: 'app-empty-state-block',
  standalone: true,
  imports: [ZyraButton, ZyraCard],
  template: \`
    <zyra-card variant="outlined" padding="lg">
      <section class="empty-state" aria-labelledby="empty-state-title">
        <div class="empty-state__icon" aria-hidden="true">BOX</div>
        <p class="empty-state__eyebrow">Nothing to review</p>
        <h2 id="empty-state-title">No reports yet</h2>
        <p class="empty-state__copy">
          Create your first report or import existing data to start tracking activity.
        </p>
        <div class="empty-state__actions">
          <zyra-button size="sm">Create report</zyra-button>
          <zyra-button size="sm" variant="outline">Import CSV</zyra-button>
        </div>
      </section>
    </zyra-card>
  \`,
  styles: [\`
    .empty-state {
      display: grid;
      justify-items: center;
      gap: 12px;
      padding: clamp(32px, 8vw, 64px) 20px;
      text-align: center;
      border-radius: 16px;
      background:
        radial-gradient(circle at top, var(--zyr-accent-muted), transparent 42%),
        var(--zyr-bg);
    }

    .empty-state__icon {
      display: grid;
      place-items: center;
      width: 56px;
      height: 56px;
      border-radius: 18px;
      background: var(--zyr-accent-muted);
      color: var(--zyr-accent);
      font: 700 0.7rem/1 var(--zyr-font-mono);
    }

    .empty-state__eyebrow {
      margin: 0;
      color: var(--zyr-accent);
      font: 700 0.72rem/1 var(--zyr-font-mono);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .empty-state h2 {
      margin: 0;
      color: var(--zyr-text);
      font-size: clamp(1.35rem, 4vw, 2rem);
    }

    .empty-state__copy {
      max-width: 34rem;
      margin: 0;
      color: var(--zyr-text-muted);
    }

    .empty-state__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 4px;
    }
  \`],
})
export class EmptyStateBlockComponent {}
`;
const EMPTY_STATE_COMPONENTS_USED = ['ZyraCard', 'ZyraButton'] as const;
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

const BLOCK_STATS: readonly BlockStat[] = [
	{ value: '12.4k', label: 'Monthly users', tone: 'accent' },
	{ value: '99.9%', label: 'Uptime SLA', tone: 'blue' },
	{ value: '4.8 / 5', label: 'Satisfaction', tone: 'purple' },
] as const;

const TOKEN_SWATCHES: readonly TokenSwatch[] = [
	{ name: 'Accent', token: '--zyr-accent', tone: 'accent' },
	{ name: 'Blue', token: '--zyr-accent-2', tone: 'blue' },
	{ name: 'Purple', token: '--zyr-accent-3', tone: 'purple' },
	{ name: 'Success', token: '--zyr-success', tone: 'success' },
	{ name: 'Warning', token: '--zyr-warning', tone: 'warning' },
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
	private emptyStateCopyResetTimer?: ReturnType<typeof setTimeout>;

	readonly installCommand = INSTALL_COMMAND;
	readonly emptyStateBlockCode = EMPTY_STATE_BLOCK_CODE;
	readonly emptyStateComponentsUsed = EMPTY_STATE_COMPONENTS_USED;
	readonly version = LIBRARY_VERSION;
	readonly copied = signal(false);
	readonly copiedEmptyStateCode = signal(false);
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
	readonly blockStats = BLOCK_STATS;
	readonly tokenSwatches = TOKEN_SWATCHES;

	ngOnInit() {
		this.seo.setSEO({
			title: 'Zyra UI — Angular Component Library with Design Tokens',
			description:
				'Zyra UI is a modern Angular component library and UI kit with design tokens, dark-mode-first theming, and accessible primitives. Built for Angular 21, signals, and SSR.',
			url: 'https://www.zyraui.dev/',
		});

		this.seo.injectJsonLd('home-software', {
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'Zyra UI',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Web',
			url: 'https://www.zyraui.dev/',
			image: 'https://www.zyraui.dev/og-preview.png',
			description:
				'A modern Angular component library and design system with design tokens, accessible UI primitives, polished motion, and dark-mode-first theming.',
			keywords:
				'Angular component library, Angular UI kit, Angular design system, Angular components, Angular 21 UI',
			offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
			author: { '@type': 'Person', name: 'Rama Jonnada' },
		});

		this.seo.injectJsonLd('home-website', {
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'Zyra UI',
			url: 'https://www.zyraui.dev/',
			description: 'Angular component library and UI design system.',
			potentialAction: {
				'@type': 'SearchAction',
				target: 'https://www.zyraui.dev/components?q={search_term_string}',
				'query-input': 'required name=search_term_string',
			},
		});
	}

	ngOnDestroy() {
		this.seo.removeJsonLd('home-software');
		this.seo.removeJsonLd('home-website');
		this.clearCopyResetTimer();
		this.clearEmptyStateCopyResetTimer();
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

	async copyEmptyStateCode() {
		try {
			if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
				throw new Error('Clipboard API is unavailable');
			}

			await navigator.clipboard.writeText(this.emptyStateBlockCode);
			this.copiedEmptyStateCode.set(true);
			this.toast.success('Empty state block copied', {
				description: 'Paste it into any standalone Angular component.',
				duration: COPY_RESET_DELAY,
			});

			this.clearEmptyStateCopyResetTimer();
			this.emptyStateCopyResetTimer = setTimeout(
				() => this.copiedEmptyStateCode.set(false),
				COPY_RESET_DELAY,
			);
		} catch {
			this.toast.info('Copy is unavailable in this browser', {
				description: 'Select the Empty State code sample manually.',
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

	private clearEmptyStateCopyResetTimer() {
		if (!this.emptyStateCopyResetTimer) {
			return;
		}

		clearTimeout(this.emptyStateCopyResetTimer);
		this.emptyStateCopyResetTimer = undefined;
	}
}

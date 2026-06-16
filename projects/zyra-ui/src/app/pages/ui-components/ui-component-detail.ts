import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastVariant, ZyraBadge, ZyraButton, ZyraToastService } from 'zyra-ng-ui';
import { getUiComponentShowcaseCard, UI_COMPONENT_SHOWCASE } from './ui-components.data';
import { map } from 'rxjs';
import { Button } from './comp/button/button';
import { Badge } from './comp/badge/badge';
import { Card } from './comp/card/card';
import { Toast } from './comp/toast/toast';
import { Avatar } from './comp/avatar/avatar';
import { Input } from './comp/input/input';
import { Spinner } from './comp/spinner/spinner';
import { Tooltip } from './comp/tooltip/tooltip';
import { Progress } from './comp/progress/progress';
import { Divider } from './comp/divider/divider';
import { Toggle } from './comp/toggle/toggle';
import { Chip } from './comp/chip/chip';
import { Alert } from './comp/alert/alert';
import { Modal } from './comp/modal/modal';
import { Accordion } from './comp/accordion/accordion';
import { Checkbox } from './comp/checkbox/checkbox';
import { Radio } from './comp/radio/radio';
import { Select } from './comp/select/select';
import { Skeleton } from './comp/skeleton/skeleton';
import { Tabs } from './comp/tabs/tabs';
import { Textarea } from './comp/textarea/textarea';
import { FormField } from './comp/form-field/form-field';
import { SeoService } from '../../../seo/seo.service';

@Component({
	selector: 'app-ui-component-detail',
	imports: [
		FormsModule,
		RouterLink,
		ZyraBadge,
		ZyraButton,
		Button,
		Badge,
		Card,
		Toast,
		Avatar,
		Input,
		Spinner,
		Tooltip,
		Progress,
		Divider,
		Toggle,
		Chip,
		Alert,
		Modal,
		Accordion,
		Checkbox,
		Radio,
		Select,
		Skeleton,
		Tabs,
		Textarea,
		FormField,
	],
	templateUrl: './ui-component-detail.html',
	styleUrl: './ui-component-detail.scss',
})
export class UiComponentDetail implements OnInit {
	private readonly route = inject(ActivatedRoute);
	private readonly toast = inject(ZyraToastService);

	private readonly seo = inject(SeoService);
	private copyResetTimer: ReturnType<typeof setTimeout> | null = null;

	demoEmail = 'hello@zyraui.dev';
	demoPassword = 'signals-only';
	demoSearch = 'button';
	copiedExampleSlug = signal<string | null>(null);

	private readonly componentSlug = toSignal(
		this.route.paramMap.pipe(map((params) => params.get('component'))),
		{ initialValue: this.route.snapshot.paramMap.get('component') },
	);

	readonly component = computed(() => getUiComponentShowcaseCard(this.componentSlug()));

	readonly relatedComponents = computed(() => {
		const slugs = this.component()?.relatedSlugs ?? [];
		return slugs.map((s) => UI_COMPONENT_SHOWCASE.find((c) => c.slug === s)).filter(Boolean);
	});

	ngOnInit(): void {
		const componentName = this.component()?.title || 'Component';
		const slug = this.component()?.slug || '';

		this.seo.setSEO({
			title: `${componentName} Component - Zyra UI`,
			description: `Learn how to use the ${componentName} component in Angular with examples and API.`,
			url: `https://www.zyraui.dev/components/${slug}`,
		});
	}
	showToast(variant: ToastVariant) {
		switch (variant) {
			case 'success':
				this.toast.success('Saved successfully', {
					description: 'Zyra toast styles are active in the live preview.',
				});
				break;
			case 'warning':
				this.toast.warning('Heads up', {
					description: 'Warnings can stay visible without interrupting the flow.',
				});
				break;
			case 'error':
				this.toast.error('Publish failed', {
					description: 'Errors surface quickly with a strong visual state.',
				});
				break;
			case 'info':
			default:
				this.toast.info('New release available', {
					description: 'Version 1.3.24 is ready to install.',
				});
		}
	}

	copyExampleCode(slug: string, code: string): void {
		if (!navigator?.clipboard) return;

		navigator.clipboard.writeText(code).then(() => {
			this.copiedExampleSlug.set(slug);

			if (this.copyResetTimer) {
				clearTimeout(this.copyResetTimer);
			}

			this.copyResetTimer = setTimeout(() => {
				if (this.copiedExampleSlug() === slug) {
					this.copiedExampleSlug.set(null);
				}
			}, 1600);
		});
	}
}

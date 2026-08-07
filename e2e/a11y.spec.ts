import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const THEMES = ['dark', 'light', 'ocean', 'amber', 'rose'] as const;

const COMPONENTS = [
	'accordion', 'alert', 'aspect-ratio', 'autocomplete', 'avatar', 'badge', 'box',
	'breadcrumb', 'button', 'button-group', 'calendar', 'card', 'carousel', 'checkbox',
	'chip', 'clipboard', 'code-block', 'command-palette', 'confirm-dialog', 'container',
	'date-picker', 'divider', 'drawer', 'dropdown-menu', 'empty-state', 'file-upload',
	'flex', 'form-field', 'grid', 'header', 'image', 'input', 'json-viewer',
	'markdown-viewer', 'modal', 'multi-select', 'pagination', 'popover', 'progress',
	'radio', 'rating', 'scroll-area', 'select', 'sidebar', 'skeleton', 'slider', 'spinner',
	'stack', 'stepper', 'switch', 'table', 'tabs', 'textarea', 'theme-switch', 'timeline',
	'toast', 'toggle', 'tooltip', 'tree-view', 'typography',
];

for (const component of COMPONENTS) {
	test.describe(`a11y: ${component}`, () => {
		for (const theme of THEMES) {
			test(`${component} — ${theme} theme`, async ({ page }) => {
				await page.goto(`/docs/components/${component}`);
				await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

				const preview = page.locator('.pg-layout__preview');
				await preview.waitFor({ state: 'visible' });

				const results = await new AxeBuilder({ page })
					.include('.pg-layout__preview')
					.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
					.analyze();

				expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
			});
		}
	});
}

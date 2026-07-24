import { Component, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZyraSidebar, ZyraSidebarItem, ZyraSidebarSection } from 'zyra-ng-ui';
import { COMPONENT_NAV_ITEMS } from './component-nav-items';

export interface NavItem {
	label: string;
	route: string;
	heading?: string;
	children?: readonly { label: string; route: string }[];
}

// Single source of truth for the docs nav — shared between the desktop
// app-sidebar rail and the header's mobile drawer (see header.html), so the
// two can never drift out of sync.
export const DOCS_NAV_ITEMS: readonly NavItem[] = [
	{ label: 'Overview', route: '/docs', heading: 'Getting started' },
	{ label: 'Installation', route: '/docs/installation' },
	{ label: 'Compatibility', route: '/docs/compatibility' },
	{ label: 'Theming', route: '/docs/theming' },
	{ label: 'Theme tokens', route: '/docs/theme-tokens' },
	{ label: 'Accessibility', route: '/docs/accessibility' },
	{ label: 'Components', route: '/docs/components', children: COMPONENT_NAV_ITEMS },
	{ label: 'Roadmap', route: '/docs/roadmap' },
	{ label: 'Blog', route: '/blog' },
];

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [RouterModule, ZyraSidebar, ZyraSidebarItem, ZyraSidebarSection],
	templateUrl: './sidebar.html',
	styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
	// ── Outputs ───────────────────────────────────────────────
	closeRequested = output<void>();

	readonly navItems = DOCS_NAV_ITEMS;

	// ── Methods ───────────────────────────────────────────────
	onNavClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		if (target.closest('a[zyra-sidebar-item]')) {
			this.closeRequested.emit();
		}
	}
}

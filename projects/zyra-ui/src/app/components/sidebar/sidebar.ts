import { booleanAttribute, Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZyraSidebar, ZyraSidebarItem, ZyraSidebarSection } from 'zyra-ng-ui';

export interface NavItem {
	label: string;
	route: string;
	heading?: string;
}

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [RouterModule, ZyraSidebar, ZyraSidebarSection, ZyraSidebarItem],
	templateUrl: './sidebar.html',
	styleUrls: ['./sidebar.scss'],
	host: {
		'[class.sidebar--open]': 'open()',
	},
})
export class Sidebar {
	// ── Inputs ────────────────────────────────────────────────
	open = input(false, { transform: booleanAttribute });

	// ── Outputs ───────────────────────────────────────────────
	closeRequested = output<void>();

	readonly navItems: readonly NavItem[] = [
		{ label: 'Overview', route: '/docs', heading: 'Getting started' },
		{ label: 'Installation', route: '/docs/installation' },
		{ label: 'Theming', route: '/docs/theming' },
		{ label: 'Theme tokens', route: '/docs/theme-tokens' },
		{ label: 'Components', route: '/docs/components' },
		{ label: 'Blog', route: '/blog' },
	];

	// ── Methods ───────────────────────────────────────────────
	onNavClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		if (target.closest('a[zyra-sidebar-item]')) {
			this.closeRequested.emit();
		}
	}
}

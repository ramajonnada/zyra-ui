import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { UI_COMPONENT_SHOWCASE } from '../../pages/ui-components/ui-components.data';

export interface NavChild {
	label: string;
	route: string;
}

export interface NavItem {
	label: string;
	route: string;
	badge?: string;
	children?: readonly NavChild[];
}

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './sidebar.html',
	styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
	private readonly router = inject(Router);

	private readonly componentChildren: readonly NavChild[] = UI_COMPONENT_SHOWCASE.map(
		(component) => ({
			label: component.title,
			route: `/components/${component.slug}`,
		}),
	);

	readonly navItems: readonly NavItem[] = [
		{ label: 'Docs', route: '/docs' },
		{ label: 'Theming', route: '/theming' },
		{
			label: 'Components',
			route: '/components',
			badge: String(this.componentChildren.length),
			children: this.componentChildren,
		},
		{ label: 'Blog', route: '/blog' },
	];

	private readonly currentPath = toSignal(
		this.router.events.pipe(
			filter((event): event is NavigationEnd => event instanceof NavigationEnd),
			map((event) => this.normalizePath(event.urlAfterRedirects)),
			startWith(this.normalizePath(this.router.url)),
		),
		{ initialValue: this.normalizePath(this.router.url) },
	);

	private hasActiveChild(item: NavItem): boolean {
		return !!item.children?.some((child) => this.currentPath().startsWith(child.route));
	}

	private normalizePath(url: string): string {
		const path = (url.split(/[?#]/, 1)[0] || '/').trim();
		return path === '' ? '/' : path;
	}
}

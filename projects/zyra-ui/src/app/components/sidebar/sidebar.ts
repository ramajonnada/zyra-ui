import { Component, Input, Output, EventEmitter, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
	label: string;
	icon: string;
	route: string;
	badge?: number;
}

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './sidebar.html',
	styleUrls: ['./sidebar.scss']
})
export class Sidebar {
	// Signal-based input (Angular 17.1+)
	readonly isOpen = input<boolean>(true);

	// Signal-based output
	readonly closeSidebar = output<void>();

	// Computed class binding from signal input
	readonly overlayVisible = computed(() => this.isOpen());

	readonly navItems: NavItem[] = [
		{ label: 'Documents', icon: '◧', route: '/docs' },
		{ label: 'Components', icon: '◈', route: '/components', badge: 8 },
		{ label: 'Blog', icon: '◻', route: '/blog-list' },
		// { label: 'Docs', icon: '⊞', route: '/docs' },
		// { label: 'Messages', icon: '◻', route: '/messages', badge: 12 },
		// { label: 'Team', icon: '◉', route: '/team' },
		// { label: 'Settings', icon: '⚙', route: '/settings' },
	];

	// readonly user = {
	// 	name: 'John Doe',
	// 	role: 'Administrator',
	// 	initials: 'JD',
	// };

	onOverlayClick() {
		this.closeSidebar.emit();
	}

}
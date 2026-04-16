import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';



export interface StatCard {
	icon: string;
	label: string;
	value: string;
	change: string;
	up: boolean;
}

export interface ActivityItem {
	title: string;
	time: string;
	color: string;
}




@Component({
	selector: 'app-main',
	imports: [CommonModule, RouterModule],
	templateUrl: './main.html',
	styleUrl: './main.scss',
})
export class Main {
	// Page meta — signals
	// readonly pageTitle = signal('Dashboard');
	readonly pageSubtitle = signal("Welcome back, John. Here's what's happening.");

	// Stats — signal of array
	readonly stats = signal<StatCard[]>([
		{ icon: '◎', label: 'Total Projects', value: '24', change: '12%', up: true },
		{ icon: '◈', label: 'Active Users', value: '1.4k', change: '8%', up: true },
		{ icon: '⊞', label: 'Revenue', value: '$92k', change: '3%', up: false },
		{ icon: '◉', label: 'Open Issues', value: '17', change: '5%', up: false },
	]);

	// Activities — signal of array
	readonly activities = signal<ActivityItem[]>([
		{ title: 'New user registered', time: '2 min ago', color: '#6366f1' },
		{ title: 'Project Alpha deployed', time: '18 min ago', color: '#10b981' },
		{ title: 'Invoice #1042 paid', time: '1 hr ago', color: '#f59e0b' },
		{ title: 'Bug #204 resolved', time: '3 hrs ago', color: '#ef4444' },
		{ title: 'Design review completed', time: 'Yesterday', color: '#8b5cf6' },
	]);

	// Computed: count of positive stats
	readonly positiveStats = computed(() =>
		this.stats().filter(s => s.up).length
	);

}

import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ZyraToastContainer } from 'zyra-ng-ui';
import { Main } from './components/main/main';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
	selector: 'app-root',
	imports: [RouterModule, Header, Footer, ZyraToastContainer, Main, Sidebar],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	readonly sidebarOpen = signal(false);
	private readonly expandedSidebarWidth = '260px';
	private readonly collapsedSidebarWidth = '84px';

	// Computed: dynamic margin for page shift
	readonly pageMargin = computed(() =>
		this.sidebarOpen() ? this.expandedSidebarWidth : this.collapsedSidebarWidth
	);

	toggleSidebar() {
		this.sidebarOpen.update(open => !open);
	}
}

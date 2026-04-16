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
	readonly sidebarOpen = signal(true);

	// Computed: dynamic margin for page shift
	readonly pageMargin = computed(() =>
		this.sidebarOpen() ? '260px' : '0px'
	);

	toggleSidebar() {
		this.sidebarOpen.update(open => !open);
	}

	closeSidebar() {
		this.sidebarOpen.set(false);
	}
}

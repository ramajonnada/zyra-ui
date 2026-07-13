// import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
// import { filter } from 'rxjs/operators';
// import { Footer } from './components/footer/footer';
// import { Header } from './components/header/header';
// import { Main } from './components/main/main';
// import { Sidebar } from './components/sidebar/sidebar';
// import { ZyraToastContainer } from 'zyra-ng-ui';

// @Component({
// 	selector: 'app-root',
// 	imports: [RouterModule, ZyraToastContainer, Main, Header, Footer, Sidebar],
// 	// imports: [ZyraToastContainer, ZyraHeader, ZyraSidebar, RouterOutlet],
// 	templateUrl: './app.html',
// 	styleUrl: './app.scss',
// })
// export class App {
// 	private readonly router = inject(Router);
// 	private readonly destroyRef = inject(DestroyRef);
// 	readonly currentPath = signal(this.normalizePath(this.router.url));

// 	readonly showSidebar = computed(() => this.isWorkspacePath(this.currentPath()));

// 	// ── Mobile sidebar drawer ────────────────────────────────
// 	readonly sidebarOpen = signal(false);

// 	toggleSidebar(): void {
// 		this.sidebarOpen.update((open) => !open);
// 	}

// 	closeSidebar(): void {
// 		this.sidebarOpen.set(false);
// 	}


// 	constructor() {
// 		this.router.events
// 			.pipe(
// 				filter((event): event is NavigationEnd => event instanceof NavigationEnd),
// 				takeUntilDestroyed(this.destroyRef),
// 			)
// 			.subscribe((event) => {
// 				this.currentPath.set(this.normalizePath(event.urlAfterRedirects));
// 				this.sidebarOpen.set(false);
// 			});
// 	}

// 	private normalizePath(url: string): string {
// 		const path = (url.split(/[?#]/, 1)[0] || '/').trim();
// 		return path === '' ? '/' : path;
// 	}

// 	private isWorkspacePath(path: string): boolean {
// 		return path.startsWith('/docs') || path.startsWith('/components') || path.startsWith('/blog');
// 	}
// }


import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Main } from './components/main/main';
import { Sidebar } from './components/sidebar/sidebar';
import { ZyraToastContainer } from 'zyra-ng-ui';

@Component({
	selector: 'app-root',
	imports: [RouterModule, ZyraToastContainer, Main, Header, Footer, Sidebar],
	// imports: [ZyraToastContainer, ZyraHeader, ZyraSidebar, RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	private readonly router = inject(Router);
	private readonly destroyRef = inject(DestroyRef);
	readonly currentPath = signal(this.normalizePath(this.router.url));

	readonly showSidebar = computed(() => this.isWorkspacePath(this.currentPath()));

	constructor() {
		this.router.events
			.pipe(
				filter((event): event is NavigationEnd => event instanceof NavigationEnd),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe((event) => {
				this.currentPath.set(this.normalizePath(event.urlAfterRedirects));
			});
	}

	private normalizePath(url: string): string {
		const path = (url.split(/[?#]/, 1)[0] || '/').trim();
		return path === '' ? '/' : path;
	}

	private isWorkspacePath(path: string): boolean {
		return path.startsWith('/docs') || path.startsWith('/components') || path.startsWith('/blog');
	}
}
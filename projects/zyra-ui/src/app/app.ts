import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Main } from './components/main/main';
import { Sidebar } from './components/sidebar/sidebar';
import { ZyraToastContainer } from 'zyra-ng-ui';

@Component({
    selector: 'app-root',
    imports: [RouterModule, Header, Footer, ZyraToastContainer, Main, Sidebar],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    private readonly expandedSidebarWidth = '240px';
    private readonly collapsedSidebarWidth = '72px';
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    readonly sidebarOpen = signal(false);
    readonly currentPath = signal(this.normalizePath(this.router.url));

    readonly showSidebar = computed(() => this.isWorkspacePath(this.currentPath()));
    readonly pageMargin = computed(() => {
        if (!this.showSidebar()) {
            return '0px';
        }

        return this.sidebarOpen() ? this.expandedSidebarWidth : this.collapsedSidebarWidth;
    });

    constructor() {
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((event) => {
                const nextPath = this.normalizePath(event.urlAfterRedirects);

                this.currentPath.set(nextPath);

                if (nextPath === '/') {
                    this.sidebarOpen.set(false);
                }
            });
    }

    toggleSidebar() {
        if (!this.showSidebar()) {
            return;
        }

        this.sidebarOpen.update((open) => !open);
    }

    private normalizePath(url: string): string {
        const path = (url.split(/[?#]/, 1)[0] || '/').trim();
        return path === '' ? '/' : path;
    }

    private isWorkspacePath(path: string): boolean {
        return path === '/docs' || path.startsWith('/components');
    }
}

import { DOCUMENT } from '@angular/common';
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
    private readonly canonicalBaseUrl = 'https://www.zyraui.dev';
    private readonly document = inject(DOCUMENT);
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
        this.updateCanonicalUrl(this.router.url);

        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((event) => {
                const nextPath = this.normalizePath(event.urlAfterRedirects);

                this.currentPath.set(nextPath);
                this.updateCanonicalUrl(event.urlAfterRedirects);

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

    private updateCanonicalUrl(url: string): void {
        const canonicalUrl = this.buildCanonicalUrl(url);
        let canonicalLink = this.document.head.querySelector(
            'link[rel="canonical"]',
        ) as HTMLLinkElement | null;

        if (!canonicalLink) {
            canonicalLink = this.document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            this.document.head.appendChild(canonicalLink);
        }

        canonicalLink.setAttribute('href', canonicalUrl);
        this.updateOgUrl(canonicalUrl);
    }

    private updateOgUrl(canonicalUrl: string): void {
        const ogUrlMeta = this.document.head.querySelector(
            'meta[property="og:url"]',
        ) as HTMLMetaElement | null;

        if (ogUrlMeta) {
            ogUrlMeta.setAttribute('content', canonicalUrl);
        }
    }

    private buildCanonicalUrl(url: string): string {
        const path = (url.split(/[?#]/, 1)[0] || '/').trim();

        if (path === '/' || path === '') {
            return `${this.canonicalBaseUrl}/`;
        }

        const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
        return `${this.canonicalBaseUrl}${normalizedPath}`;
    }

    private normalizePath(url: string): string {
        const path = (url.split(/[?#]/, 1)[0] || '/').trim();
        return path === '' ? '/' : path;
    }

    private isWorkspacePath(path: string): boolean {
        return path === '/docs' || path.startsWith('/components');
    }
}

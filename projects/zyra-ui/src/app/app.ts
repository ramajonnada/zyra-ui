import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
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
    private readonly canonicalBaseUrl = 'https://www.zyraui.dev';
    private readonly document = inject(DOCUMENT);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.updateCanonicalUrl(this.router.url);

        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((event) => {
                this.updateCanonicalUrl(event.urlAfterRedirects);
            });
    }

    // Computed: dynamic margin for page shift
    readonly pageMargin = computed(() =>
        this.sidebarOpen() ? this.expandedSidebarWidth : this.collapsedSidebarWidth,
    );

    toggleSidebar() {
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
}

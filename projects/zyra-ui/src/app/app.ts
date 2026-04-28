import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ZyraToastContainer } from 'zyra-ng-ui';
import { Main } from './components/main/main';
import { Sidebar } from './components/sidebar/sidebar';
import { SeoService } from './services/seo.service';

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
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly seo = inject(SeoService);

    constructor() {
        this.seo.applyRouteSeo(this.router.routerState.snapshot.root, this.router.url);

        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((event) => {
                this.seo.applyRouteSeo(
                    this.router.routerState.snapshot.root,
                    event.urlAfterRedirects,
                );
            });
    }

    // Computed: dynamic margin for page shift
    readonly pageMargin = computed(() =>
        this.sidebarOpen() ? this.expandedSidebarWidth : this.collapsedSidebarWidth,
    );

    toggleSidebar() {
        this.sidebarOpen.update((open) => !open);
    }
}

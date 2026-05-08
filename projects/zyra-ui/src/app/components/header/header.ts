import {
    Component,
    HostListener,
    PLATFORM_ID,
    afterNextRender,
    computed,
    inject,
    output,
    signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { ZyraButton, ZyraThemeService } from 'zyra-ng-ui';
import { appIcons } from '../../shared/fontawesome-icons';

interface HeaderLink {
    label: string;
    route: string;
}

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, ZyraButton, FaIconComponent],
    templateUrl: './header.html',
    styleUrl: './header.scss',
    host: {
        '[class.is-scrolled]': 'isScrolled()',
    },
})
export class Header {
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly themeService = inject(ZyraThemeService);

    readonly toggleSidebar = output<void>();
    readonly icons = appIcons;
    readonly version = 'v1.4.26';
    readonly githubStars = '';
    readonly isScrolled = signal(false);
    readonly mobileNavOpen = signal(false);
    readonly navLinks: readonly HeaderLink[] = [
        { label: 'Components', route: '/components' },
        { label: 'Docs', route: '/docs' },
        { label: 'Blog', route: '/blog' },
        { label: 'Contact', route: '/contact' },
    ];

    readonly currentPath = toSignal(
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            map((event) => this.normalizePath(event.urlAfterRedirects)),
            startWith(this.normalizePath(this.router.url)),
        ),
        { initialValue: this.normalizePath(this.router.url) },
    );
    readonly isDark = computed(() => this.themeService.isDark());
    readonly isWorkspacePage = computed(
        () => this.currentPath() === '/docs' || this.currentPath().startsWith('/components'),
    );
    readonly publicPage = computed(() => !this.isWorkspacePage());
    readonly menuLabel = computed(() =>
        this.publicPage()
            ? this.mobileNavOpen()
                ? 'Close navigation menu'
                : 'Open navigation menu'
            : 'Toggle sidebar',
    );

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            afterNextRender(() => this.updateScrolledState());
        }
    }

    @HostListener('window:scroll')
    onWindowScroll() {
        this.updateScrolledState();
    }

    toggleTheme() {
        this.themeService.toggle();
    }

    onToggle() {
        if (this.publicPage()) {
            this.mobileNavOpen.update((open) => !open);
            return;
        }

        this.toggleSidebar.emit();
    }

    closeMobileNav() {
        this.mobileNavOpen.set(false);
    }

    private normalizePath(url: string): string {
        const path = (url.split(/[?#]/, 1)[0] || '/').trim();
        return path === '' ? '/' : path;
    }

    private updateScrolledState() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.isScrolled.set(window.scrollY > 12);
    }
}

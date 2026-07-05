import {
    Component,
    HostListener,
    PLATFORM_ID,
    afterNextRender,
    computed,
    inject,
    signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ZyraIcon, ZyraTheme } from 'zyra-ng-ui';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ZyraButton, ZyraThemeService } from 'zyra-ng-ui';
import { github, check, swatchbook, caretDown } from 'zyra-ng-ui';
import { GithubService } from '../../services/github.service';
import { LIBRARY_VERSION } from '../../shared/version';

interface HeaderLink {
    label: string;
    route: string;
}

interface ThemeOption {
    value: ZyraTheme;
    label: string;
    accent: string;
    surface: string;
}

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, ZyraButton, ZyraIcon],
    templateUrl: './header.html',
    styleUrl: './header.scss',
    host: {
        '[class.is-scrolled]': 'isScrolled()',
    },
})
export class Header {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly themeService = inject(ZyraThemeService);
    private readonly github = inject(GithubService);

    readonly icons = { github, check, swatchbook, caretDown };
    readonly version = LIBRARY_VERSION;
    readonly isScrolled = signal(false);
    readonly githubStars = toSignal(this.github.stars$, { initialValue: null });
    readonly mobileNavOpen = signal(false);
    readonly themeDropdownOpen = signal(false);

    readonly navLinks: readonly HeaderLink[] = [
        { label: 'Components', route: '/components' },
        { label: 'Docs', route: '/docs' },
        { label: 'Theming', route: '/theming' },
        { label: 'Blog', route: '/blog' },
    ];

    readonly themes: readonly ThemeOption[] = [
        { value: 'dark',  label: 'Dark',  accent: '#007a8a', surface: '#172232' },
        { value: 'light', label: 'Light', accent: '#007a8a', surface: '#ecedf1' },
        { value: 'ocean', label: 'Ocean', accent: '#1a6ec8', surface: '#eaf0f8' },
        { value: 'amber', label: 'Amber', accent: '#b06020', surface: '#f0e8d8' },
        { value: 'rose',  label: 'Rose',  accent: '#d03050', surface: '#faedf1' },
    ];

    readonly currentTheme = this.themeService.theme;
    readonly currentThemeOption = computed(
        () => this.themes.find(t => t.value === this.currentTheme()) ?? this.themes[0],
    );

    readonly menuLabel = computed(() =>
        this.mobileNavOpen() ? 'Close navigation menu' : 'Open navigation menu',
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

    @HostListener('document:keydown.escape')
    onEscape() {
        this.themeDropdownOpen.set(false);
    }

    toggleThemeDropdown(event: Event) {
        event.stopPropagation();
        this.themeDropdownOpen.update(o => !o);
    }

    stopProp(event: Event) {
        event.stopPropagation();
    }

    @HostListener('document:click')
    closeThemeDropdown() {
        this.themeDropdownOpen.set(false);
    }

    selectTheme(theme: ZyraTheme) {
        this.themeService.setTheme(theme);
        this.themeDropdownOpen.set(false);
    }

    onToggle() {
        this.mobileNavOpen.update((open) => !open);
    }

    closeMobileNav() {
        this.mobileNavOpen.set(false);
    }

    private updateScrolledState() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.isScrolled.set(window.scrollY > 12);
    }
}

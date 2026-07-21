import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ZyraIcon } from 'zyra-ng-ui';
import { rocket, star, xmark } from 'zyra-ng-ui';
import { GithubService } from '../../services/github.service';

interface Highlight {
    /** Bump this only for a headline release (new components, new templates,
     *  a major feature) — NOT on every patch bump. Changing it re-shows the
     *  banner even to visitors who dismissed a previous highlight. */
    id: string;
    message: string;
    linkLabel: string;
    link: string;
}

// Maintainer-curated — update by hand when there's something worth
// announcing. See the `Highlight` doc comment above for when to bump `id`.
const LATEST_HIGHLIGHT: Highlight = {
    id: 'components-56',
    message: 'Zyra UI now ships 56 accessible, token-driven components.',
    linkLabel: 'Browse components',
    link: '/docs/components',
};

const STORAGE_KEY_PREFIX = 'zyra-announcement-dismissed-';

@Component({
    selector: 'app-announcement-bar',
    imports: [RouterLink, ZyraIcon],
    host: { '[class.is-collapsed]': 'collapsed()' },
    templateUrl: './announcement-bar.html',
    styleUrl: './announcement-bar.scss',
})
export class AnnouncementBar {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly github = inject(GithubService);

    readonly icons = { rocket, star, xmark };
    readonly highlight = LATEST_HIGHLIGHT;
    readonly githubStars = toSignal(this.github.stars$, { initialValue: null });

    /** Set by the scroll-container owner (see Main) to temporarily tuck the
     *  bar away while scrolling down, independent of the dismissed state. */
    readonly collapsed = input(false);

    // Starts hidden on the server and during first paint to avoid a
    // hydration mismatch — localStorage doesn't exist on the server, so the
    // dismissed state can only be known once the browser check below runs.
    readonly visible = signal(false);

    private readonly storageKey = `${STORAGE_KEY_PREFIX}${this.highlight.id}`;

    constructor() {
        if (!isPlatformBrowser(this.platformId)) return;

        try {
            const dismissed = localStorage.getItem(this.storageKey) === 'true';
            this.visible.set(!dismissed);
        } catch {
            // Storage may be unavailable (private browsing, disabled cookies) —
            // fail open and just show the banner without persisting dismissal.
            this.visible.set(true);
        }
    }

    dismiss(): void {
        this.visible.set(false);
        if (!isPlatformBrowser(this.platformId)) return;

        try {
            localStorage.setItem(this.storageKey, 'true');
        } catch {
            // Ignore — worst case the banner reappears next visit.
        }
    }
}

import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnnouncementBar } from '../announcement-bar/announcement-bar';

const SCROLL_HIDE_THRESHOLD = 40;

@Component({
    selector: 'app-main',
    imports: [RouterModule, AnnouncementBar],
    templateUrl: './main.html',
    styleUrl: './main.scss',
})
export class Main {
    // Hides the announcement bar while the user is scrolling down through
    // page content (mirrors the common "hide on scroll down, reveal on
    // scroll up" pattern) so it doesn't permanently eat into the reading
    // area — especially on mobile, where every pixel of vertical space
    // matters. `<main>` (not `window`) is the actual scroll container.
    readonly bannerCollapsed = signal(false);
    private lastScrollTop = 0;

    onMainScroll(event: Event): void {
        const scrollTop = (event.target as HTMLElement).scrollTop;
        const delta = scrollTop - this.lastScrollTop;

        if (scrollTop <= SCROLL_HIDE_THRESHOLD) {
            this.bannerCollapsed.set(false);
        } else if (delta > 4) {
            this.bannerCollapsed.set(true);
        } else if (delta < -4) {
            this.bannerCollapsed.set(false);
        }

        this.lastScrollTop = scrollTop;
    }
}

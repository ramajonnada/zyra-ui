import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { RouterModule } from '@angular/router';
import { appIcons } from '../../shared/fontawesome-icons';

export interface NavItem {
    label: string;
    icon: IconDefinition;
    route: string;
    badge?: string;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, FaIconComponent],
    templateUrl: './sidebar.html',
    styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
    readonly isOpen = input<boolean>(true);
    readonly toggleSidebar = output<void>();
    readonly overlayVisible = computed(() => this.isOpen());

    readonly navItems: readonly NavItem[] = [
        { label: 'Docs', icon: appIcons.folder, route: '/docs' },
        { label: 'Components', icon: appIcons.cubes, route: '/components', badge: '9' },
        { label: 'Blog', icon: appIcons.message, route: '/blog' },
        { label: 'Contact', icon: appIcons.envelope, route: '/contact' },
    ];

    onToggleSidebar() {
        this.toggleSidebar.emit();
    }

    onOverlayClick() {
        this.toggleSidebar.emit();
    }
}

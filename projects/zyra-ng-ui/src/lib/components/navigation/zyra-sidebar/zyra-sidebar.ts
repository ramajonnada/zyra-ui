import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
    selector: 'zyra-sidebar',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-sidebar.html',
    styleUrl: './zyra-sidebar.scss',
})
export class ZyraSidebar {
    // ── Inputs ────────────────────────────────────────────────
    width = input<string>('260px');
    collapsedWidth = input<string>('72px');

    // ── Two-way state ─────────────────────────────────────────
    collapsed = model<boolean>(false);

    // ── Methods ───────────────────────────────────────────────
    toggle(): void {
        this.collapsed.set(!this.collapsed());
    }
}

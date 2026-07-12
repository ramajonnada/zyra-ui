import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    input,
    OnDestroy,
    PLATFORM_ID,
    Renderer2,
    signal,
    viewChild,
} from '@angular/core';
import { ZYRA_DROPDOWN_MENU, type ZyraDropdownMenuRef } from './zyra-dropdown-menu-token';

export type DropdownMenuAlign = 'start' | 'end';

@Component({
    selector: 'zyra-dropdown-menu',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ZYRA_DROPDOWN_MENU,
            useExisting: forwardRef(() => ZyraDropdownMenu),
        },
    ],
    host: { class: 'zyr-dropdown' },
    templateUrl: './zyra-dropdown-menu.html',
    styleUrl: './zyra-dropdown-menu.scss',
})
export class ZyraDropdownMenu implements ZyraDropdownMenuRef, AfterViewInit, OnDestroy {
    // ── Inputs ────────────────────────────────────────────────
    align = input<DropdownMenuAlign>('start');

    // ── State ─────────────────────────────────────────────────
    readonly isOpen = signal(false);

    private readonly _trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
    private readonly _panel = viewChild.required<ElementRef<HTMLElement>>('panel');

    private readonly _renderer = inject(Renderer2);
    private readonly _document = inject(DOCUMENT);
    private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    private readonly _reposition = (): void => this._updatePosition();

    // ── Lifecycle ─────────────────────────────────────────────
    ngAfterViewInit(): void {
        // Move the panel out of any clipping ancestor (scroll containers,
        // modals, tab panels) by attaching it directly to <body>, positioned
        // via getBoundingClientRect() instead of relying on CSS containment.
        if (!this._isBrowser) return;
        this._renderer.appendChild(this._document.body, this._panel().nativeElement);
    }

    ngOnDestroy(): void {
        if (!this._isBrowser) return;
        this._removeListeners();
        this._panel().nativeElement.remove();
    }

    // ── Open / close ──────────────────────────────────────────
    toggle(): void {
        if (this.isOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu(): void {
        if (this.isOpen()) return;
        this.isOpen.set(true);
        if (this._isBrowser) {
            this._updatePosition();
            window.addEventListener('scroll', this._reposition, true);
            window.addEventListener('resize', this._reposition);
        }
    }

    closeMenu(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
        this._removeListeners();
    }

    private _removeListeners(): void {
        if (!this._isBrowser) return;
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
    }

    private _updatePosition(): void {
        const trigger = this._trigger().nativeElement;
        const panel = this._panel().nativeElement;
        const rect = trigger.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const gap = 6;
        const edge = 8;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Flip above the trigger if there isn't enough room below.
        const top =
            rect.bottom + gap + panelRect.height > vh - edge && rect.top - gap - panelRect.height >= edge
                ? rect.top - gap - panelRect.height
                : rect.bottom + gap;
        panel.style.top = `${Math.min(Math.max(top, edge), vh - panelRect.height - edge)}px`;

        // Clamp horizontally so the panel never runs past the viewport edge.
        if (this.align() === 'end') {
            const right = window.innerWidth - rect.right;
            panel.style.right = `${Math.min(Math.max(right, edge), vw - panelRect.width - edge)}px`;
            panel.style.left = 'auto';
        } else {
            const left = rect.left;
            panel.style.left = `${Math.min(Math.max(left, edge), vw - panelRect.width - edge)}px`;
            panel.style.right = 'auto';
        }
    }

    // ── Click outside ─────────────────────────────────────────
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.isOpen()) return;
        const target = event.target as Node;
        const insideTrigger = this._trigger().nativeElement.contains(target);
        const insidePanel = this._panel().nativeElement.contains(target);
        if (!insideTrigger && !insidePanel) {
            this.closeMenu();
        }
    }

    // ── Escape to close ───────────────────────────────────────
    @HostListener('keydown.escape')
    onEscape(): void {
        this.closeMenu();
    }
}

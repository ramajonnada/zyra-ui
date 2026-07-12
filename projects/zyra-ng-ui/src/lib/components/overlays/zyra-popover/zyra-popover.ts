import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostListener,
    inject,
    input,
    OnDestroy,
    PLATFORM_ID,
    Renderer2,
    signal,
    viewChild,
} from '@angular/core';

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover';

let popoverIdCounter = 0;

const GAP = 10;

@Component({
    selector: 'zyra-popover',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-popover.html',
    styleUrl: './zyra-popover.scss',
})
export class ZyraPopover implements AfterViewInit, OnDestroy {
    private readonly _elementRef = inject(ElementRef<HTMLElement>);
    private readonly _renderer = inject(Renderer2);
    private readonly _document = inject(DOCUMENT);
    private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    // ── Inputs ────────────────────────────────────────────────
    position = input<PopoverPosition>('bottom');
    trigger = input<PopoverTrigger>('click');
    closeOnOutsideClick = input(true, { transform: booleanAttribute });

    // ── State ─────────────────────────────────────────────────
    open = signal(false);

    private readonly _trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
    private readonly _panel = viewChild.required<ElementRef<HTMLElement>>('panel');

    private readonly _reposition = (): void => this._updatePosition();

    // ── ID ────────────────────────────────────────────────────
    readonly panelId = `zyr-popover-${++popoverIdCounter}`;

    // ── Computed ──────────────────────────────────────────────
    panelClass = computed(
        () =>
            `zyr-popover__panel zyr-popover__panel--${this.position()}` +
            (this.open() ? ' zyr-popover__panel--open' : ''),
    );

    // ── Lifecycle ─────────────────────────────────────────────
    ngAfterViewInit(): void {
        // Move the panel out of any clipping ancestor (scroll containers,
        // overflow:hidden stages) by attaching it directly to <body>,
        // positioned via getBoundingClientRect() instead of CSS containment.
        if (!this._isBrowser) return;
        this._renderer.appendChild(this._document.body, this._panel().nativeElement);
    }

    ngOnDestroy(): void {
        if (!this._isBrowser) return;
        this._removeListeners();
        this._panel().nativeElement.remove();
    }

    // ── Trigger handlers ──────────────────────────────────────
    onTriggerClick(): void {
        if (this.trigger() !== 'click') return;
        if (this.open()) {
            this._close();
        } else {
            this._openPopover();
        }
    }

    onTriggerMouseEnter(): void {
        if (this.trigger() !== 'hover') return;
        this._openPopover();
    }

    onTriggerMouseLeave(): void {
        if (this.trigger() !== 'hover') return;
        this._close();
    }

    // ── Outside click ─────────────────────────────────────────
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.open() || !this.closeOnOutsideClick() || this.trigger() !== 'click') return;
        const target = event.target as Node;
        const insideTrigger = this._elementRef.nativeElement.contains(target);
        const insidePanel = this._panel().nativeElement.contains(target);
        if (!insideTrigger && !insidePanel) {
            this._close();
        }
    }

    private _openPopover(): void {
        if (this.open()) return;
        this.open.set(true);
        if (!this._isBrowser) return;
        this._updatePosition();
        window.addEventListener('scroll', this._reposition, true);
        window.addEventListener('resize', this._reposition);
    }

    private _close(): void {
        if (!this.open()) return;
        this.open.set(false);
        if (!this._isBrowser) return;
        this._removeListeners();
    }

    private _removeListeners(): void {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
    }

    private _updatePosition(): void {
        const trigger = this._trigger().nativeElement;
        const panel = this._panel().nativeElement;
        const rect = trigger.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let top: number;
        let left: number;

        switch (this.position()) {
            case 'top':
                top = rect.top - panelRect.height - GAP;
                left = rect.left + rect.width / 2 - panelRect.width / 2;
                break;
            case 'left':
                top = rect.top + rect.height / 2 - panelRect.height / 2;
                left = rect.left - panelRect.width - GAP;
                break;
            case 'right':
                top = rect.top + rect.height / 2 - panelRect.height / 2;
                left = rect.right + GAP;
                break;
            default:
                top = rect.bottom + GAP;
                left = rect.left + rect.width / 2 - panelRect.width / 2;
                break;
        }

        // Clamp within the viewport so the panel is never pushed off-screen.
        top = Math.min(Math.max(top, GAP), vh - panelRect.height - GAP);
        left = Math.min(Math.max(left, GAP), vw - panelRect.width - GAP);

        panel.style.top = `${top}px`;
        panel.style.left = `${left}px`;
    }
}

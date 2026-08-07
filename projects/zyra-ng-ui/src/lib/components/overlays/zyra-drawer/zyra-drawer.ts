import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Injector,
    OnDestroy,
    ViewChild,
    afterNextRender,
    computed,
    effect,
    inject,
    input,
    model,
    output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { lockBodyScroll, unlockBodyScroll } from '../../../internal/body-scroll-lock';
import type { ZyraSize } from '../../../shared/zyra-size';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = ZyraSize;

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

@Component({
    selector: 'zyra-drawer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-drawer.html',
    styleUrl: './zyra-drawer.scss',
})
export class ZyraDrawer implements OnDestroy {
    @ViewChild('drawerPanel') drawerPanel!: ElementRef<HTMLElement>;

    // ── Inputs ────────────────────────────────────────────────
    open = model<boolean>(false);
    side = input<DrawerSide>('right');
    size = input<DrawerSize>('md');
    title = input<string>('');
    dismissible = input(true, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────
    closed = output<void>();

    // ── Computed ──────────────────────────────────────────────
    panelClass = computed(
        () => `zyr-drawer__panel zyr-drawer__panel--${this.side()} zyr-drawer__panel--${this.size()}`,
    );

    private _injector = inject(Injector);
    private _doc = inject(DOCUMENT);
    private _hasScrollLock = false;

    constructor() {
        effect(() => {
            if (this.open()) {
                if (!this._hasScrollLock) {
                    lockBodyScroll(this._doc);
                    this._hasScrollLock = true;
                }
                afterNextRender(() => this.drawerPanel?.nativeElement?.focus(), {
                    injector: this._injector,
                });
            } else if (this._hasScrollLock) {
                unlockBodyScroll(this._doc);
                this._hasScrollLock = false;
            }
        });
    }

    // ── Methods ───────────────────────────────────────────────
    close(): void {
        if (!this.dismissible()) return;
        this.open.set(false);
        this.closed.emit();
    }

    closeForced(): void {
        this.open.set(false);
        this.closed.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.close();
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this.open()) this.close();
    }

    // ── Focus trap ────────────────────────────────────────────
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (!this.open() || event.key !== 'Tab') return;
        const panel = this.drawerPanel?.nativeElement;
        if (!panel) return;

        const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = this._doc.activeElement as HTMLElement;

        if (event.shiftKey && (active === first || active === panel)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && (active === last || active === panel)) {
            event.preventDefault();
            first.focus();
        }
    }

    ngOnDestroy(): void {
        if (this._hasScrollLock) {
            unlockBodyScroll(this._doc);
            this._hasScrollLock = false;
        }
    }
}

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Inject,
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

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

@Component({
    selector: 'zyra-modal',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-modal.html',
    styleUrl: './zyra-modal.scss',
})
export class ZyraModal implements OnDestroy {
    @ViewChild('modalPanel') modalPanel!: ElementRef<HTMLElement>;

    // ── Inputs ────────────────────────────────────────────────
    open = model<boolean>(false);
    size = input<ModalSize>('md');
    title = input<string>('');
    dismissible = input<boolean>(true);

    // ── Outputs ───────────────────────────────────────────────
    closed = output<void>();

    // ── Computed ──────────────────────────────────────────────
    panelClass = computed(() => `zyr-modal__panel zyr-modal__panel--${this.size()}`);

    private _injector = inject(Injector);

    constructor(@Inject(DOCUMENT) private _doc: Document) {
        effect(() => {
            if (this.open()) {
                this._doc.body.style.overflow = 'hidden';
                afterNextRender(() => this.modalPanel?.nativeElement?.focus(), {
                    injector: this._injector,
                });
            } else {
                this._doc.body.style.overflow = '';
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
        const panel = this.modalPanel?.nativeElement;
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
        this._doc.body.style.overflow = '';
    }
}

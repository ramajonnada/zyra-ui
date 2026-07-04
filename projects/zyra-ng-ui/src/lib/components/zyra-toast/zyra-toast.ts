import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Injectable,
    input,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZyraIcon as ZyraIconComponent, type ZyraIconData } from '../../internal/zyra-icon/zyra-icon';
import { check, xmark, triangleExclamation, circleInfo, circle } from '../../shared/zyra-icons';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface Toast {
    id: string;
    variant: ToastVariant;
    title: string;
    description: string;
    duration: number; // ms — 0 = persistent
}

// ─────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ZyraToastService {
    private _toasts = signal<Toast[]>([]);

    // Public readonly signal
    toasts = this._toasts.asReadonly();

    // ── Public API ────────────────────────────────────────────
    success(title: string, opts: Partial<Omit<Toast, 'id' | 'variant' | 'title'>> = {}) {
        this.add({ variant: 'success', title, ...opts });
    }

    error(title: string, opts: Partial<Omit<Toast, 'id' | 'variant' | 'title'>> = {}) {
        this.add({ variant: 'error', title, ...opts });
    }

    warning(title: string, opts: Partial<Omit<Toast, 'id' | 'variant' | 'title'>> = {}) {
        this.add({ variant: 'warning', title, ...opts });
    }

    info(title: string, opts: Partial<Omit<Toast, 'id' | 'variant' | 'title'>> = {}) {
        this.add({ variant: 'info', title, ...opts });
    }

    dismiss(id: string) {
        this._toasts.update((list) => list.filter((t) => t.id !== id));
    }

    dismissAll() {
        this._toasts.set([]);
    }

    // ── Internal ──────────────────────────────────────────────
    private add(
        toast: Omit<Toast, 'id' | 'description' | 'duration'> &
            Partial<Pick<Toast, 'description' | 'duration'>>,
    ) {
        const t: Toast = {
            id: Math.random().toString(36).slice(2),
            description: '',
            duration: 4000,
            ...toast,
        };
        this._toasts.update((list) => [...list, t]);
        if (t.duration > 0) {
            setTimeout(() => this.dismiss(t.id), t.duration);
        }
    }
}

// ─────────────────────────────────────────────────────────────────
// Single Toast component
// ─────────────────────────────────────────────────────────────────
@Component({
    selector: 'zyra-toast-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent],
    templateUrl: './zyra-toast.html',
    styleUrl: './zyra-toast.scss',
})
export class ZyraToastItem {
    toast = input.required<Toast>();
    toastService = inject(ZyraToastService);
    readonly closeIcon = xmark;

    hostClass = computed(() => `zyr-toast zyr-toast--${this.toast().variant}`);

    icon = computed((): ZyraIconData => {
        const map: Record<ToastVariant, ZyraIconData> = {
            success: check,
            error: xmark,
            warning: triangleExclamation,
            info: circleInfo,
            default: circle,
        };
        return map[this.toast().variant];
    });
}

// ─────────────────────────────────────────────────────────────────
// Toast Container component — place once in AppComponent template
// ─────────────────────────────────────────────────────────────────
@Component({
    selector: 'zyra-toast-container',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ZyraToastItem],
    template: `
        <div
            class="zyr-toast-container"
            role="region"
            aria-label="Notifications"
            aria-live="polite"
        >
            @for (t of toastService.toasts(); track t.id) {
                <zyra-toast-item [toast]="t" />
            }
        </div>
    `,
    styleUrl: './zyra-toast.scss',
})
export class ZyraToastContainer {
    toastService = inject(ZyraToastService);
}

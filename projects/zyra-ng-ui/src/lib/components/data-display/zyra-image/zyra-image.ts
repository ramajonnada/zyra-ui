import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ZyraIcon } from '../../../internal/zyra-icon/zyra-icon';
import { ZyraSkeleton } from '../../feedback/zyra-skeleton/zyra-skeleton';
import { imageIcon } from '../../../shared/zyra-icons';

export type ImageObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ImageRatio = number | `${number}/${number}` | `${number}:${number}`;

function parseRatio(value: ImageRatio): number {
    if (typeof value === 'number') return value;
    const [w, h] = value.split(/[/:]/).map(Number);
    return w / h;
}

@Component({
    selector: 'zyra-image',
    standalone: true,
    imports: [ZyraIcon, ZyraSkeleton],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-image.html',
    styleUrl: './zyra-image.scss',
})
export class ZyraImage {
    // ── Inputs ────────────────────────────────────────────────
    src = input.required<string>();
    alt = input<string>('');
    fallbackSrc = input<string>('');
    ratio = input<ImageRatio | null>(null);
    objectFit = input<ImageObjectFit>('cover');
    radius = input<ImageRadius>('none');
    loading = input<'lazy' | 'eager'>('lazy');
    /** Sets loading="eager" + fetchpriority="high" for above-the-fold images; overrides `loading`. */
    priority = input<boolean>(false);
    width = input<number | null>(null);
    height = input<number | null>(null);
    srcset = input<string>('');
    sizes = input<string>('');
    caption = input<string>('');

    // ── Outputs ───────────────────────────────────────────────
    loaded = output<void>();
    error = output<void>();

    // ── Internal state ───────────────────────────────────────
    private readonly usedFallback = signal(false);
    readonly status = signal<'loading' | 'loaded' | 'error'>('loading');

    constructor() {
        // Reset transient load state whenever the primary src changes —
        // otherwise a prior error/fallback sticks around and resolvedSrc()
        // keeps pointing at the stale fallbackSrc() instead of retrying the
        // new src.
        effect(() => {
            this.src();
            this.usedFallback.set(false);
            this.status.set('loading');
        });
    }

    // ── Computed ──────────────────────────────────────────────
    resolvedSrc = computed(() => (this.usedFallback() ? this.fallbackSrc() : this.src()));

    readonly imageIcon = imageIcon;

    hostClass = computed(() => {
        const classes = ['zyr-image', `zyr-image--radius-${this.radius()}`];
        if (this.ratio() !== null) classes.push('zyr-image--ratio');
        return classes.join(' ');
    });

    hostStyle = computed(() => {
        const r = this.ratio();
        return r === null ? {} : { 'padding-bottom': `${(1 / parseRatio(r)) * 100}%` };
    });

    imgStyle = computed(() => ({ 'object-fit': this.objectFit() }));
    resolvedLoading = computed<'lazy' | 'eager'>(() => (this.priority() ? 'eager' : this.loading()));
    fetchPriority = computed<'high' | null>(() => (this.priority() ? 'high' : null));

    // ── Methods ───────────────────────────────────────────────
    onLoad(): void {
        this.status.set('loaded');
        this.loaded.emit();
    }

    onError(): void {
        if (this.fallbackSrc() && !this.usedFallback()) {
            this.usedFallback.set(true);
            this.status.set('loading');
            return;
        }
        this.status.set('error');
        this.error.emit();
    }
}

import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'teal' | 'blue' | 'purple' | 'warm' | 'neutral';

@Component({
    selector: 'zyra-avatar',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-avatar.html',
    styleUrl: './zyra-avatar.scss',
})
export class ZyraAvatar {
    // ── Inputs ────────────────────────────────────────────────
    name = input<string>('');
    src = input<string>('');
    size = input<AvatarSize>('md');
    variant = input<AvatarVariant>('teal');
    online = input<boolean | null>(null);
    square = input<boolean>(false);

    // ── Internal ──────────────────────────────────────────────
    imgError = signal(false);

    // ── Computed ──────────────────────────────────────────────
    initials = computed(() => {
        const n = this.name().trim();
        if (!n) return '?';
        const parts = n.split(' ').filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    });

    ariaLabel = computed(() => (this.name() ? `Avatar for ${this.name()}` : 'Avatar'));

    hostClass = computed(() => {
        const classes = [
            'zyr-avatar',
            `zyr-avatar--${this.size()}`,
            `zyr-avatar--${this.variant()}`,
        ];
        if (this.square()) classes.push('zyr-avatar--square');
        return classes.join(' ');
    });

    hostStyle = computed(() => (this.src() && !this.imgError() ? '' : ''));
}

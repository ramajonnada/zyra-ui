import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import {
    BoxBackground,
    BORDER_COLOR,
    BoxRadius,
    BoxShadow,
    BoxSpacing,
    SHADOW,
    spacingStyle,
    toDimension,
} from '../../../internal/box-style/box-style';

export type BoxDisplay = 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
export type BoxOverflow = 'visible' | 'hidden' | 'auto' | 'scroll' | 'clip';
export type BoxPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type BoxCursor = 'auto' | 'pointer' | 'default' | 'not-allowed' | 'grab' | 'text' | 'move' | 'wait';
export type BoxUserSelect = 'auto' | 'none' | 'text' | 'all';
export type { BoxBackground, BoxRadius, BoxShadow, BoxSpacing };

@Component({
    selector: 'zyra-box',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-box.html',
    styleUrl: './zyra-box.scss',
})
export class ZyraBox {
    // ── Inputs — spacing ────────────────────────────────────────
    display = input<BoxDisplay>('block');

    padding = input<BoxSpacing>('none');
    paddingX = input<BoxSpacing | undefined>(undefined);
    paddingY = input<BoxSpacing | undefined>(undefined);

    margin = input<BoxSpacing>('none');
    marginX = input<BoxSpacing | undefined>(undefined);
    marginY = input<BoxSpacing | undefined>(undefined);

    rounded = input<BoxRadius>('none');
    background = input<BoxBackground>('none');
    border = input(false, { transform: booleanAttribute });

    // ── Inputs — dimensions ───────────────────────────────────────
    width = input<string | number | undefined>(undefined);
    height = input<string | number | undefined>(undefined);
    minWidth = input<string | number | undefined>(undefined);
    maxWidth = input<string | number | undefined>(undefined);
    minHeight = input<string | number | undefined>(undefined);
    maxHeight = input<string | number | undefined>(undefined);

    // ── Inputs — overflow ─────────────────────────────────────────
    overflow = input<BoxOverflow>('visible');
    overflowX = input<BoxOverflow | undefined>(undefined);
    overflowY = input<BoxOverflow | undefined>(undefined);

    // ── Inputs — elevation & interaction ──────────────────────────
    shadow = input<BoxShadow>('none');
    position = input<BoxPosition>('static');
    top = input<string | number | undefined>(undefined);
    right = input<string | number | undefined>(undefined);
    bottom = input<string | number | undefined>(undefined);
    left = input<string | number | undefined>(undefined);
    cursor = input<BoxCursor>('auto');
    userSelect = input<BoxUserSelect>('auto');

    // ── Computed ──────────────────────────────────────────────────
    hostClass = computed(() => {
        const parts = ['zyr-box'];
        if (this.border()) parts.push('zyr-box--border');
        return parts.join(' ');
    });

    hostStyle = computed(() => {
        const overflowX = this.overflowX();
        const overflowY = this.overflowY();
        const overflow = this.overflow();

        return {
            display: this.display(),
            ...spacingStyle({
                padding: this.padding(),
                paddingX: this.paddingX(),
                paddingY: this.paddingY(),
                margin: this.margin(),
                marginX: this.marginX(),
                marginY: this.marginY(),
                rounded: this.rounded(),
                background: this.background(),
            }),
            width: toDimension(this.width()) ?? '',
            height: toDimension(this.height()) ?? '',
            'min-width': toDimension(this.minWidth()) ?? '',
            'max-width': toDimension(this.maxWidth()) ?? '',
            'min-height': toDimension(this.minHeight()) ?? '',
            'max-height': toDimension(this.maxHeight()) ?? '',
            overflow,
            'overflow-x': overflowX ?? overflow,
            'overflow-y': overflowY ?? overflow,
            'box-shadow': SHADOW[this.shadow()],
            position: this.position(),
            top: toDimension(this.top()) ?? '',
            right: toDimension(this.right()) ?? '',
            bottom: toDimension(this.bottom()) ?? '',
            left: toDimension(this.left()) ?? '',
            cursor: this.cursor(),
            'user-select': this.userSelect(),
            'border-color': this.border() ? BORDER_COLOR[this.background()] : '',
        };
    });
}

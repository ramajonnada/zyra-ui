import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input } from '@angular/core';
import { ZyraThemeService } from '../../../theme/theme-service';
import { ZyraTheme, ZYRA_THEME_NAMES } from '../../../theme/theme-type';
import { ZyraDropdownMenu } from '../../navigation/zyra-dropdown-menu/zyra-dropdown-menu';
import { ZyraIcon } from '../../../internal/zyra-icon/zyra-icon';
import { check, moon, sun } from '../../../shared/zyra-icons';

export type ThemeSwitchMode = 'toggle' | 'menu';

interface ThemeSwitchOption {
    value: ZyraTheme;
    label: string;
}

const THEME_LABELS: Record<ZyraTheme, string> = {
    dark: 'Dark',
    light: 'Light',
    ocean: 'Ocean',
    amber: 'Amber',
    rose: 'Rose',
};

@Component({
    selector: 'zyra-theme-switch',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraDropdownMenu, ZyraIcon],
    templateUrl: './zyra-theme-switch.html',
    styleUrl: './zyra-theme-switch.scss',
})
export class ZyraThemeSwitch {
    // ── Inputs ────────────────────────────────────────────────
    /** "toggle" flips between dark/light on click; "menu" opens a picker for all themes. */
    mode = input<ThemeSwitchMode>('menu');
    ariaLabel = input<string>('Toggle theme', { alias: 'aria-label' });
    disabled = input(false, { transform: booleanAttribute });

    // ── Service ───────────────────────────────────────────────
    private readonly _themeService = inject(ZyraThemeService);

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => 'zyr-theme-switch');
    currentTheme = this._themeService.theme;
    isDark = this._themeService.isDark;
    triggerIcon = computed(() => (this.isDark() ? moon : sun));
    checkIcon = check;

    readonly options: readonly ThemeSwitchOption[] = ZYRA_THEME_NAMES.map((value) => ({
        value,
        label: THEME_LABELS[value],
    }));

    // ── Methods ───────────────────────────────────────────────
    handleTriggerClick(): void {
        if (this.disabled()) return;
        if (this.mode() === 'toggle') {
            this._themeService.toggle();
        }
    }

    selectTheme(theme: ZyraTheme): void {
        if (this.disabled()) return;
        this._themeService.setTheme(theme);
    }
}

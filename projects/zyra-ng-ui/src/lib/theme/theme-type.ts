import { InjectionToken } from '@angular/core';

export type ZyraTheme = 'dark' | 'light' | 'ocean' | 'amber' | 'rose';

export const ZYRA_THEME_NAMES: readonly ZyraTheme[] = ['dark', 'light', 'ocean', 'amber', 'rose'];

export const ZYRA_THEME_COLOR_SCHEME: Record<ZyraTheme, 'dark' | 'light'> = {
    dark:  'dark',
    light: 'light',
    ocean: 'light',
    amber: 'light',
    rose:  'light',
};

export interface ZyraConfig {
    theme?: ZyraTheme;
    storageKey?: string;
    respectSystemTheme?: boolean;
}

export const ZYRA_CONFIG = new InjectionToken<ZyraConfig>('ZYRA_CONFIG');

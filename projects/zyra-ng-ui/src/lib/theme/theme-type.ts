import { InjectionToken } from '@angular/core';

export type ZyraTheme = 'dark' | 'light';

export interface ZyraConfig {
    theme?: ZyraTheme;
    storageKey?: string; // localStorage key, default: 'zyra-theme'
    respectSystemTheme?: boolean; // follow OS preference on first load
}

export const ZYRA_CONFIG = new InjectionToken<ZyraConfig>('ZYRA_CONFIG');

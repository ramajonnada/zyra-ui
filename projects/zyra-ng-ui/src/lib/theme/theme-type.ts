export enum ZyraThemeType {
	Light = 'light',
	Dark = 'dark',
}

// export type ZyraThemeType = 'light' | 'dark';


// ============================================================
// ZYRA NG UI — Theme Types (theme-type.ts)
// ============================================================

export type ZyraTheme = 'dark' | 'light';

export interface ZyraConfig {
	theme?: ZyraTheme;
	storageKey?: string;   // localStorage key, default: 'zyra-theme'
	respectSystemTheme?: boolean; // follow OS preference on first load
}

export const ZYRA_CONFIG = Symbol('ZYRA_CONFIG');
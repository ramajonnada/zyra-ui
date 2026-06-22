import { InjectionToken } from '@angular/core';
import type { ZyraTab } from './zyra-tab';

export interface ZyraTabsRef {
    activateTab(tab: ZyraTab): void;
    activeTabId(): string | null;
}

export const ZYRA_TABS = new InjectionToken<ZyraTabsRef>('ZyraTabs');

export type SlideDir = 'left' | 'right' | null;

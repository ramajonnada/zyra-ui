import { InjectionToken } from '@angular/core';

export interface ZyraDropdownMenuRef {
    closeMenu(): void;
}

export const ZYRA_DROPDOWN_MENU = new InjectionToken<ZyraDropdownMenuRef>('ZyraDropdownMenu');

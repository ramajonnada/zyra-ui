import { InjectionToken } from '@angular/core';
import type { ZyraOption } from './zyra-option';

export interface ZyraSelectRef {
    selectOption(option: ZyraOption): void;
}

export const ZYRA_SELECT = new InjectionToken<ZyraSelectRef>('ZyraSelect');

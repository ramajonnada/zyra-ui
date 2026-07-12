import { InjectionToken } from '@angular/core';
import type { ZyraRadio } from './zyra-radio';

export interface ZyraRadioGroupRef {
    value(): string | number | null;
    disabled(): boolean;
    selectRadio(radio: ZyraRadio): void;
}

export const ZYRA_RADIO_GROUP = new InjectionToken<ZyraRadioGroupRef>('ZyraRadioGroup');

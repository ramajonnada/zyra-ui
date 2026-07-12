import { InjectionToken } from '@angular/core';
import type { ButtonColor, ButtonRadius, ButtonSize, ButtonVariant, ZyraButton } from './zyra-button';

export type ButtonGroupSelectionMode = 'none' | 'single' | 'multiple';

export interface ZyraButtonGroupRef {
    size(): ButtonSize | undefined;
    variant(): ButtonVariant | undefined;
    color(): ButtonColor | undefined;
    radius(): ButtonRadius | undefined;
    disabled(): boolean;
    selectionMode(): ButtonGroupSelectionMode;
    isSelected(value: string | number): boolean;
    toggle(value: string | number): void;
    /** Roving-tabindex: is this button the one member of the group currently reachable by Tab? */
    isActive(button: ZyraButton): boolean;
    /** Called on native focus so the group can track the last-focused member for roving tabindex. */
    registerFocus(button: ZyraButton): void;
}

export const ZYRA_BUTTON_GROUP = new InjectionToken<ZyraButtonGroupRef>('ZyraButtonGroup');

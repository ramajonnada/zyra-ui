import { WritableSignal } from '@angular/core';

export interface ButtonGroupControl {
    type: 'button-group';
    key: string;
    label: string;
    options: readonly string[];
    signal: WritableSignal<string>;
}

export interface ToggleControl {
    type: 'toggle';
    key: string;
    label: string;
    toggleLabel: string;
    signal: WritableSignal<boolean>;
}

export interface TextControl {
    type: 'text';
    key: string;
    label: string;
    placeholder?: string;
    signal: WritableSignal<string>;
}

export type ControlDef = ButtonGroupControl | ToggleControl | TextControl;

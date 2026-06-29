import { Type } from '@angular/core';

// ── Per-control config (no signals — engine creates them at runtime) ──────────

export interface PgButtonGroupControl {
    type: 'button-group';
    key: string;
    label: string;
    options: readonly string[];
    defaultValue: string;
}

export interface PgToggleControl {
    type: 'toggle';
    key: string;
    label: string;
    toggleLabel: string;
    defaultValue: boolean;
}

export interface PgTextControl {
    type: 'text';
    key: string;
    label: string;
    placeholder?: string;
    defaultValue: string;
}

export type PgControlDef = PgButtonGroupControl | PgToggleControl | PgTextControl;

// ── Top-level playground config ───────────────────────────────────────────────

export interface PlaygroundConfig {
    // A thin renderer component that accepts control values as signal inputs
    // and renders the actual library component (handles ng-content / slots).
    renderer: Type<unknown>;
    controls: PgControlDef[];
    codeTemplate: (state: Record<string, unknown>) => string;
    stageClass?: 'column' | 'vertical' | '';
}

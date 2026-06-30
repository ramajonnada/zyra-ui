import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playground } from './playground';
import { PlaygroundConfig } from './playground-config';

// ── Minimal renderer stub ─────────────────────────────────────────────────────
// Must use input() — NgComponentOutlet drives inputs through the input() API
import { input } from '@angular/core';

@Component({ selector: 'pg-stub', standalone: true, template: '<span>stub</span>' })
class StubRenderer {
    variant = input('primary');
    disabled = input(false);
    label = input('Hello');
}

// ── Shared config factory ─────────────────────────────────────────────────────
function makeConfig(overrides?: Partial<PlaygroundConfig>): PlaygroundConfig {
    return {
        renderer: StubRenderer,
        controls: [
            {
                type: 'button-group',
                key: 'variant',
                label: 'Variant',
                options: ['primary', 'secondary'],
                defaultValue: 'primary',
            },
            {
                type: 'toggle',
                key: 'disabled',
                label: 'Disabled',
                toggleLabel: 'disabled',
                defaultValue: false,
            },
            {
                type: 'text',
                key: 'label',
                label: 'Label',
                placeholder: 'Enter text…',
                defaultValue: 'Hello',
            },
        ],
        codeTemplate: (s) => `<stub variant="${s['variant']}">${s['label']}</stub>`,
        ...overrides,
    };
}

// ── Host ──────────────────────────────────────────────────────────────────────
@Component({
    standalone: true,
    imports: [Playground],
    template: `<app-playground [config]="cfg" />`,
})
class PlaygroundHostComponent {
    cfg = makeConfig();
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Playground', () => {
    let fixture: ComponentFixture<PlaygroundHostComponent>;
    let pg: Playground;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlaygroundHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PlaygroundHostComponent);
        fixture.detectChanges();
        pg = fixture.debugElement.children[0].componentInstance as Playground;
    });

    it('creates the component', () => {
        expect(pg).toBeTruthy();
    });

    // ── _signalMap ────────────────────────────────────────────────────────────
    it('_signalMap has one entry per control', () => {
        const keys = Object.keys(pg._signalMap());
        expect(keys.length).toBe(3);
    });

    it('_signalMap keys match control keys', () => {
        const keys = Object.keys(pg._signalMap());
        expect(keys).toContain('variant');
        expect(keys).toContain('disabled');
        expect(keys).toContain('label');
    });

    it('_signalMap initialises each signal to the control defaultValue', () => {
        const map = pg._signalMap();
        expect(map['variant']()).toBe('primary');
        expect(map['disabled']()).toBe(false);
        expect(map['label']()).toBe('Hello');
    });

    // ── state ─────────────────────────────────────────────────────────────────
    it('state() snapshot reflects all default values', () => {
        const s = pg.state();
        expect(s['variant']).toBe('primary');
        expect(s['disabled']).toBe(false);
        expect(s['label']).toBe('Hello');
    });

    it('state() updates reactively when a signal changes', () => {
        pg._signalMap()['variant'].set('secondary');
        fixture.detectChanges();
        expect(pg.state()['variant']).toBe('secondary');
    });

    // ── controlDefs ───────────────────────────────────────────────────────────
    it('controlDefs returns one entry per control', () => {
        expect(pg.controlDefs().length).toBe(3);
    });

    it('controlDefs preserves type from the original control config', () => {
        const types = pg.controlDefs().map((c) => c.type);
        expect(types).toContain('button-group');
        expect(types).toContain('toggle');
        expect(types).toContain('text');
    });

    it('each controlDef has a live WritableSignal', () => {
        pg.controlDefs().forEach((def) => {
            expect(typeof def.signal).toBe('function');
            expect(typeof def.signal.set).toBe('function');
        });
    });

    // ── code ──────────────────────────────────────────────────────────────────
    it('code() calls codeTemplate with the current state', () => {
        expect(pg.code()).toBe('<stub variant="primary">Hello</stub>');
    });

    it('code() updates when state changes', () => {
        pg._signalMap()['label'].set('World');
        fixture.detectChanges();
        expect(pg.code()).toContain('World');
    });

    // ── config re-initialisation ──────────────────────────────────────────────
    it('_signalMap resets when config reference changes', () => {
        // New config with only the 'label' key (StubRenderer has label as input())
        const newCfg = makeConfig({
            controls: [
                {
                    type: 'text',
                    key: 'label',
                    label: 'Label',
                    placeholder: 'Text…',
                    defaultValue: 'Updated',
                },
            ],
        });
        fixture.componentInstance.cfg = newCfg;
        fixture.detectChanges();
        const keys = Object.keys(pg._signalMap());
        expect(keys).toEqual(['label']);
        expect(pg._signalMap()['label']()).toBe('Updated');
    });
});

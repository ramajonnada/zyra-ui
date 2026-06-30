import { PLAYGROUND_REGISTRY } from './playground-registry';

const EXPECTED_SLUGS = [
    'button', 'badge', 'avatar', 'chip', 'card',
    'accordion', 'divider', 'input', 'form-field', 'toggle',
    'select', 'textarea', 'checkbox', 'radio', 'tabs',
    'spinner', 'progress', 'alert', 'skeleton', 'toast',
    'tooltip', 'modal',
] as const;

describe('PLAYGROUND_REGISTRY', () => {

    // ── coverage ──────────────────────────────────────────────────────────────
    it('has exactly 22 entries', () => {
        expect(Object.keys(PLAYGROUND_REGISTRY).length).toBe(22);
    });

    it('contains every expected component slug', () => {
        EXPECTED_SLUGS.forEach((slug) => {
            expect(PLAYGROUND_REGISTRY[slug])
                .withContext(`missing registry entry for "${slug}"`)
                .toBeTruthy();
        });
    });

    // ── structural integrity ──────────────────────────────────────────────────
    EXPECTED_SLUGS.forEach((slug) => {
        describe(`${slug}`, () => {
            it('has a renderer component', () => {
                expect(PLAYGROUND_REGISTRY[slug].renderer).toBeTruthy();
            });

            it('has at least one control', () => {
                expect(PLAYGROUND_REGISTRY[slug].controls.length).toBeGreaterThan(0);
            });

            it('has a codeTemplate function', () => {
                expect(typeof PLAYGROUND_REGISTRY[slug].codeTemplate).toBe('function');
            });

            it('each control has a type, key, and label', () => {
                PLAYGROUND_REGISTRY[slug].controls.forEach((ctrl) => {
                    expect(ctrl.type).toBeTruthy();
                    expect(ctrl.key).toBeTruthy();
                    // label may be empty string — just check it is defined
                    expect(ctrl.label).toBeDefined();
                });
            });

            it('each button-group control has at least 2 options', () => {
                PLAYGROUND_REGISTRY[slug].controls
                    .filter((c) => c.type === 'button-group')
                    .forEach((c) => {
                        expect((c as unknown as { options: readonly string[] }).options.length).toBeGreaterThanOrEqual(2);
                    });
            });

            it('codeTemplate returns a non-empty string for default state', () => {
                const config = PLAYGROUND_REGISTRY[slug];
                const defaultState: Record<string, unknown> = {};
                config.controls.forEach((c) => (defaultState[c.key] = c.defaultValue));
                const code = config.codeTemplate(defaultState);
                expect(typeof code).toBe('string');
                expect(code.length).toBeGreaterThan(0);
            });
        });
    });

    // ── button codeTemplate ───────────────────────────────────────────────────
    it('button codeTemplate with all defaults returns minimal tag', () => {
        const cfg = PLAYGROUND_REGISTRY['button'];
        const code = cfg.codeTemplate({
            variant: 'primary',
            size: 'md',
            loading: false,
            disabled: false,
            fullWidth: false,
            label: 'Button',
        });
        expect(code).toBe('<zyra-button>\n  Button\n</zyra-button>');
    });

    it('button codeTemplate adds variant attribute when not primary', () => {
        const cfg = PLAYGROUND_REGISTRY['button'];
        const code = cfg.codeTemplate({
            variant: 'ghost',
            size: 'md',
            loading: false,
            disabled: false,
            fullWidth: false,
            label: 'Click me',
        });
        expect(code).toContain('variant="ghost"');
    });

    it('button codeTemplate adds [loading]="true" when loading is true', () => {
        const cfg = PLAYGROUND_REGISTRY['button'];
        const code = cfg.codeTemplate({
            variant: 'primary',
            size: 'md',
            loading: true,
            disabled: false,
            fullWidth: false,
            label: 'Button',
        });
        expect(code).toContain('[loading]="true"');
    });

    // ── badge codeTemplate ────────────────────────────────────────────────────
    it('badge codeTemplate with defaults produces a valid tag', () => {
        const cfg = PLAYGROUND_REGISTRY['badge'];
        const defaultState: Record<string, unknown> = {};
        cfg.controls.forEach((c) => (defaultState[c.key] = c.defaultValue));
        const code = cfg.codeTemplate(defaultState);
        expect(code).toContain('zyra-badge');
    });
});

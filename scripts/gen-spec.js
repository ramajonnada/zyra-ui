#!/usr/bin/env node
/**
 * gen-spec.js — auto-generate a meaningful Angular spec file from a source file.
 *
 * Usage:
 *   node scripts/gen-spec.js <path/to/source.ts>
 *
 * The script writes <path/to/source.spec.ts> next to the source file.
 * If a spec already exists, it prints a diff-friendly preview and asks for --force
 * before overwriting.
 *
 * Supported source types:
 *   @Injectable  → service tests (inject, method calls, observables)
 *   @Component   → component tests (create, signals, inputs, outputs, computed, methods)
 *   @Pipe        → pipe tests (transform with sample values)
 */
'use strict';

const fs = require('fs');
const path = require('path');

// ── CLI ───────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const force = args.includes('--force');
const srcArg = args.find((a) => !a.startsWith('--'));

if (!srcArg) {
    console.error('Usage: node scripts/gen-spec.js <path/to/source.ts> [--force]');
    process.exit(1);
}

const srcPath = path.resolve(process.cwd(), srcArg);
if (!fs.existsSync(srcPath)) {
    console.error(`File not found: ${srcPath}`);
    process.exit(1);
}

const specPath = srcPath.replace(/\.ts$/, '.spec.ts');
if (fs.existsSync(specPath) && !force) {
    console.warn(`Spec already exists: ${specPath}`);
    console.warn('Run with --force to overwrite.');
    process.exit(0);
}

// ── Parse source ──────────────────────────────────────────────────────────────
const src = fs.readFileSync(srcPath, 'utf8');

function extract(pattern, flags = 'g') {
    return [...src.matchAll(new RegExp(pattern, flags))];
}

function first(pattern, flags = '') {
    const m = src.match(new RegExp(pattern, flags));
    return m ? m[1] : null;
}

// Determine type
const isService = /@Injectable/.test(src);
const isComponent = /@Component/.test(src);
const isPipe = /@Pipe/.test(src);

// Class name
const className = first('export class (\\w+)');
if (!className) {
    console.error('No exported class found.');
    process.exit(1);
}

// Imports from the source so we can re-export the right thing
const importedFrom = first(`import.*\\b${className}\\b.*from ['"]([^'"]+)['"]`);
const localImport = importedFrom || `./${path.basename(srcPath, '.ts')}`;

// ── Extract structural information ────────────────────────────────────────────

// signals: readonly foo = signal(defaultValue)
const signals = extract(/readonly\s+(\w+)\s*=\s*signal\(([^)]*)\)/);

// computed: readonly foo = computed(...)
const computeds = extract(/readonly\s+(\w+)\s*=\s*computed\(/);

// inputs: readonly foo = input(defaultValue) or input<Type>(defaultValue)
const inputs = extract(/readonly\s+(\w+)\s*=\s*input(?:<[^>]*>)?\(([^)]*)\)/);
// also model(): readonly foo = model(defaultValue)
const models = extract(/readonly\s+(\w+)\s*=\s*model(?:<[^>]*>)?\(([^)]*)\)/);

// outputs: readonly foo = output<Type>()
const outputs = extract(/readonly\s+(\w+)\s*=\s*output(?:<[^>]*>)?\(\)/);

// Public methods (not private/protected, not lifecycle)
const LIFECYCLE = new Set([
    'ngOnInit',
    'ngOnDestroy',
    'ngAfterViewInit',
    'ngOnChanges',
    'ngAfterContentInit',
]);
const methodMatches = extract(/(?:^|\s)(?!private|protected)(\w+)\s*\([^)]*\)\s*(?::\s*\S+)?\s*\{/m);
const publicMethods = methodMatches
    .map((m) => m[1])
    .filter(
        (n) =>
            n !== className &&
            !LIFECYCLE.has(n) &&
            !['constructor', 'if', 'for', 'while', 'switch'].includes(n),
    )
    .filter((n, i, arr) => arr.indexOf(n) === i);

// SeoService usage
const usesSeo = /inject\(SeoService\)/.test(src);

// HttpClient usage
const usesHttp = /inject\(HttpClient\)/.test(src);

// Router usage
const usesRouter = /inject\(Router\)/.test(src) || /ActivatedRoute/.test(src);

// ZyraThemeService usage
const usesTheme = /inject\(ZyraThemeService\)/.test(src);

// lifecycle hooks present
const hasNgOnInit = /ngOnInit\s*\(/.test(src);
const hasNgOnDestroy = /ngOnDestroy\s*\(/.test(src);

// readonly data arrays / plain values (const arrays on class)
const readonlyArrays = extract(/readonly\s+(\w+)(?::\s*readonly\s+\w[^=]*)?\s*=\s*\[/);

// ── Helpers for code generation ───────────────────────────────────────────────
function defaultValueFor(raw) {
    const v = (raw || '').trim();
    if (!v) return '(anything)';
    if (v === 'false' || v === 'true') return v;
    if (/^\d/.test(v)) return v;
    if (v.startsWith("'") || v.startsWith('"') || v.startsWith('`')) return v;
    return v;
}

function singularize(name) {
    return name.endsWith('s') ? name.slice(0, -1) : name;
}

// ── Generate spec content ─────────────────────────────────────────────────────
const lines = [];

function L(line = '') {
    lines.push(line);
}

// --- Imports ---
const imports = new Set();
if (isService) {
    imports.add("import { TestBed } from '@angular/core/testing';");
    if (usesHttp) {
        imports.add("import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';");
        imports.add("import { provideHttpClient } from '@angular/common/http';");
    }
} else if (isComponent) {
    imports.add("import { ComponentFixture, TestBed } from '@angular/core/testing';");
    if (usesRouter) {
        imports.add("import { provideRouter } from '@angular/router';");
    }
    if (usesHttp) {
        imports.add("import { provideHttpClient } from '@angular/common/http';");
        imports.add("import { provideHttpClientTesting } from '@angular/common/http/testing';");
    }
    if (usesTheme) {
        imports.add("import { ZyraThemeService } from 'zyra-ng-ui';");
    }
    if (usesSeo && hasNgOnInit) {
        imports.add("import { Title } from '@angular/platform-browser';");
    }
}

// Always import the class under test
imports.add(`import { ${className} } from '${localImport}';`);

imports.forEach((i) => L(i));
L();

// --- describe block ---
if (isService) {
    L(`describe('${className}', () => {`);
    L(`    let service: ${className};`);
    if (usesHttp) {
        L(`    let httpMock: HttpTestingController;`);
    }
    L();

    // providers
    const providers = [];
    if (usesHttp) providers.push('provideHttpClient()', 'provideHttpClientTesting()');

    L(`    beforeEach(() => {`);
    L(`        TestBed.configureTestingModule({`);
    if (providers.length) {
        L(`            providers: [${providers.join(', ')}],`);
    }
    L(`        });`);
    L(`        service = TestBed.inject(${className});`);
    if (usesHttp) {
        L(`        httpMock = TestBed.inject(HttpTestingController);`);
    }
    L(`    });`);
    if (usesHttp) {
        L();
        L(`    afterEach(() => httpMock.verify());`);
    }
    L();

    // create test
    L(`    it('should be created', () => {`);
    L(`        expect(service).toBeTruthy();`);
    L(`    });`);

    // method tests
    publicMethods.forEach((method) => {
        L();
        L(`    // ── ${method}() ─────────────────────────────────────────────────────────`);
        L(`    it('${method}() ...', () => {`);
        L(`        // TODO: arrange inputs and assert expected behavior`);
        L(`        expect(service.${method}).toBeDefined();`);
        L(`    });`);
    });

    L(`});`);
} else if (isComponent) {
    L(`describe('${className}', () => {`);
    L(`    let component: ${className};`);
    L(`    let fixture: ComponentFixture<${className}>;`);
    if (usesTheme) {
        L(`    let themeService: ZyraThemeService;`);
    }
    L();

    // providers
    const providers = [];
    if (usesRouter) providers.push('provideRouter([])');
    if (usesHttp) providers.push('provideHttpClient()', 'provideHttpClientTesting()');

    L(`    beforeEach(async () => {`);
    L(`        await TestBed.configureTestingModule({`);
    L(`            imports: [${className}],`);
    if (providers.length) {
        L(`            providers: [${providers.join(', ')}],`);
    }
    L(`        }).compileComponents();`);
    L();
    L(`        fixture = TestBed.createComponent(${className});`);
    L(`        component = fixture.componentInstance;`);
    if (usesTheme) {
        L(`        themeService = TestBed.inject(ZyraThemeService);`);
    }
    L(`        fixture.detectChanges();`);
    L(`    });`);
    L();

    // create test
    L(`    it('should create', () => {`);
    L(`        expect(component).toBeTruthy();`);
    L(`    });`);

    // signals
    if (signals.length) {
        L();
        L(`    // ── signals (default values) ──────────────────────────────────────────`);
        signals.forEach(([, name, rawDefault]) => {
            const def = defaultValueFor(rawDefault);
            L();
            L(`    it('${name} signal defaults to ${def}', () => {`);
            if (def === 'false' || def === 'true') {
                L(`        expect(component.${name}()).toBe(${def});`);
            } else if (/^\d/.test(def)) {
                L(`        expect(component.${name}()).toBe(${def});`);
            } else if (def === "''") {
                L(`        expect(component.${name}()).toBe('');`);
            } else {
                L(`        expect(component.${name}()).toBeTruthy();`);
            }
            L(`    });`);
        });
    }

    // inputs
    if (inputs.length || models.length) {
        const allInputs = [...inputs, ...models];
        L();
        L(`    // ── inputs ────────────────────────────────────────────────────────────`);
        allInputs.forEach(([, name, rawDefault]) => {
            const def = defaultValueFor(rawDefault);
            L();
            L(`    it('${name} input defaults to ${def}', () => {`);
            L(`        expect(component.${name}()).toBeDefined();`);
            L(`    });`);
            L();
            L(`    it('${name} input can be set via setInput', () => {`);
            L(`        // Replace the value below with a valid test value`);
            L(`        fixture.componentRef.setInput('${name}', ${def !== '(anything)' ? def : 'undefined'});`);
            L(`        fixture.detectChanges();`);
            L(`        // expect(component.${name}()).toBe(expectedValue);`);
            L(`    });`);
        });
    }

    // outputs
    if (outputs.length) {
        L();
        L(`    // ── outputs ───────────────────────────────────────────────────────────`);
        outputs.forEach(([, name]) => {
            L();
            L(`    it('${name} emits when triggered', () => {`);
            L(`        let emitted = false;`);
            L(`        component.${name}.subscribe(() => (emitted = true));`);
            L(`        // TODO: trigger the action that causes ${name} to emit`);
            L(`        // expect(emitted).toBeTrue();`);
            L(`    });`);
        });
    }

    // computed
    if (computeds.length) {
        L();
        L(`    // ── computed signals ──────────────────────────────────────────────────`);
        computeds.forEach(([, name]) => {
            L();
            L(`    it('${name}() returns a defined value by default', () => {`);
            L(`        expect(component.${name}()).toBeDefined();`);
            L(`    });`);
        });
    }

    // readonly arrays (data integrity)
    if (readonlyArrays.length) {
        L();
        L(`    // ── data integrity ────────────────────────────────────────────────────`);
        readonlyArrays.forEach(([, name]) => {
            const item = singularize(name);
            L();
            L(`    it('${name} is not empty', () => {`);
            L(`        expect(component.${name}.length).toBeGreaterThan(0);`);
            L(`    });`);
            L();
            L(`    it('each ${item} in ${name} has required fields', () => {`);
            L(`        component.${name}.forEach((${item}) => {`);
            L(`            // TODO: replace 'label' with a required field from the interface`);
            L(`            // expect(${item}.label).toBeTruthy();`);
            L(`        });`);
            L(`    });`);
        });
    }

    // public methods
    if (publicMethods.length) {
        L();
        L(`    // ── methods ───────────────────────────────────────────────────────────`);
        publicMethods.forEach((method) => {
            L();
            L(`    it('${method}() does not throw', () => {`);
            L(`        expect(() => component.${method}()).not.toThrow();`);
            L(`    });`);
        });
    }

    // lifecycle hooks
    if (usesSeo && hasNgOnInit) {
        L();
        L(`    // ── SEO ───────────────────────────────────────────────────────────────`);
        L();
        L(`    it('ngOnInit sets the document title', () => {`);
        L(`        const titleService = TestBed.inject(Title);`);
        L(`        expect(titleService.getTitle()).toBeTruthy();`);
        L(`    });`);
    }

    if (hasNgOnDestroy) {
        L();
        L(`    it('ngOnDestroy does not throw', () => {`);
        L(`        expect(() => component.ngOnDestroy()).not.toThrow();`);
        L(`    });`);
    }

    L(`});`);
} else if (isPipe) {
    const pipeName = first(/name:\s*['"](\w+)['"]/);
    L(`import { ${className} } from '${localImport}';`);
    L();
    L(`describe('${className}', () => {`);
    L(`    let pipe: ${className};`);
    L();
    L(`    beforeEach(() => {`);
    L(`        pipe = new ${className}();`);
    L(`    });`);
    L();
    L(`    it('creates an instance', () => {`);
    L(`        expect(pipe).toBeTruthy();`);
    L(`    });`);
    L();
    L(`    it('transform() returns expected output for a known input', () => {`);
    L(`        // TODO: replace with real test values`);
    L(`        // expect(pipe.transform('input')).toBe('expectedOutput');`);
    L(`    });`);
    L(`});`);
} else {
    console.error('Could not detect @Injectable, @Component, or @Pipe.');
    process.exit(1);
}

// ── Write output ──────────────────────────────────────────────────────────────
const output = lines.join('\n') + '\n';
fs.writeFileSync(specPath, output, 'utf8');
console.log(`✔  Generated: ${specPath}`);

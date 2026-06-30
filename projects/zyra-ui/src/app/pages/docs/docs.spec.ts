import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Docs } from './docs';

describe('Docs', () => {
    let component: Docs;
    let fixture: ComponentFixture<Docs>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Docs],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(Docs);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── installSteps ──────────────────────────────────────────────────────────
    it('exposes 4 install steps', () => {
        expect(component.installSteps.length).toBe(4);
    });

    it('first step covers package installation', () => {
        expect(component.installSteps[0].title).toContain('Install');
    });

    it('second step covers global styles import', () => {
        expect(component.installSteps[1].title).toContain('styles');
    });

    it('third step covers provider registration', () => {
        expect(component.installSteps[2].code).toContain('provideZyra');
    });

    it('fourth step covers component import and usage', () => {
        expect(component.installSteps[3].code).toContain('ZyraButton');
    });

    it('steps have sequential labels 01–04', () => {
        const stepNumbers = component.installSteps.map((s) => s.step);
        expect(stepNumbers).toEqual(['01', '02', '03', '04']);
    });

    // ── componentList ─────────────────────────────────────────────────────────
    it('componentList has 22 entries', () => {
        expect(component.componentList.length).toBe(22);
    });

    it('componentList includes the button component', () => {
        const btn = component.componentList.find((c) => c.slug === 'button');
        expect(btn).toBeTruthy();
        expect(btn?.selector).toBe('zyra-button');
        expect(btn?.importName).toBe('ZyraButton');
    });

    it('componentList includes the modal component', () => {
        const modal = component.componentList.find((c) => c.slug === 'modal');
        expect(modal).toBeTruthy();
        expect(modal?.importName).toBe('ZyraModal');
    });

    it('componentList includes Select, Textarea, Checkbox, Radio, Tabs, and Skeleton', () => {
        const slugs = component.componentList.map((c) => c.slug);
        ['select', 'textarea', 'checkbox', 'radio', 'tabs', 'skeleton'].forEach((slug) =>
            expect(slugs).toContain(slug),
        );
    });

    it('each componentList entry has name, selector, importName and category', () => {
        component.componentList.forEach((c) => {
            expect(c.name).toBeTruthy();
            expect(c.selector).toBeTruthy();
            expect(c.importName).toBeTruthy();
            expect(c.category).toBeTruthy();
        });
    });

    // ── tokenGroups ───────────────────────────────────────────────────────────
    it('exposes 4 token groups', () => {
        expect(component.tokenGroups.length).toBe(4);
    });

    it('first token group is Color', () => {
        expect(component.tokenGroups[0].label).toBe('Color');
    });

    it('Color token group includes --zyr-accent and --zyr-bg', () => {
        const colorGroup = component.tokenGroups[0];
        expect(colorGroup.tokens).toContain('--zyr-accent');
        expect(colorGroup.tokens).toContain('--zyr-bg');
    });

    it('Typography token group includes font tokens', () => {
        const typo = component.tokenGroups.find((g) => g.label === 'Typography');
        expect(typo?.tokens).toContain('--zyr-font-body');
        expect(typo?.tokens).toContain('--zyr-font-display');
    });
});

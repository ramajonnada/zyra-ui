import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';
import { UI_COMPONENT_SHOWCASE } from '../ui-components/ui-components.data';

describe('Home', () => {
    let component: Home;
    let fixture: ComponentFixture<Home>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Home],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(Home);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── static data integrity ─────────────────────────────────────────────────
    it('componentCount matches the UI_COMPONENT_SHOWCASE array length', () => {
        expect(component.componentCount).toBe(UI_COMPONENT_SHOWCASE.length);
    });

    it('componentCount is 22', () => {
        expect(component.componentCount).toBe(22);
    });

    it('installCommand is the npm install command', () => {
        expect(component.installCommand).toBe('npm install zyra-ng-ui');
    });

    it('heroMeta contains "Open source"', () => {
        expect(component.heroMeta).toContain('Open source');
    });

    it('heroMeta contains "MIT Licensed"', () => {
        expect(component.heroMeta).toContain('MIT Licensed');
    });

    it('heroMeta contains "TypeScript ready"', () => {
        expect(component.heroMeta).toContain('TypeScript ready');
    });

    it('version is defined', () => {
        expect(component.version).toBeTruthy();
    });

    it('featureCards has 6 entries', () => {
        expect(component.featureCards.length).toBe(6);
    });

    it('installSteps has 3 entries', () => {
        expect(component.installSteps.length).toBe(3);
    });

    it('tokenSwatches has 5 entries', () => {
        expect(component.tokenSwatches.length).toBe(5);
    });

    // ── copied signal ─────────────────────────────────────────────────────────
    it('copied signal starts as false', () => {
        expect(component.copied()).toBeFalse();
    });

    // ── copyInstallCommand — clipboard unavailable ────────────────────────────
    it('copyInstallCommand shows an info toast when clipboard API is unavailable', async () => {
        const originalNavigator = Object.getOwnPropertyDescriptor(window, 'navigator');

        // Make clipboard unavailable
        Object.defineProperty(window, 'navigator', {
            value: { ...navigator, clipboard: undefined },
            configurable: true,
        });

        const toastSpy = spyOn(
            (component as unknown as { toast: { info: (...args: unknown[]) => void } }).toast,
            'info',
        );

        await component.copyInstallCommand();

        expect(toastSpy).toHaveBeenCalledOnceWith(
            'Copy is unavailable in this browser',
            jasmine.objectContaining({ description: 'npm install zyra-ng-ui' }),
        );

        if (originalNavigator) {
            Object.defineProperty(window, 'navigator', originalNavigator);
        }
    });

    // ── lifecycle ─────────────────────────────────────────────────────────────
    it('ngOnDestroy does not throw', () => {
        expect(() => component.ngOnDestroy()).not.toThrow();
    });
});

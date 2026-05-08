import { TestBed } from '@angular/core/testing';
import { ZYRA_CONFIG } from './theme-type';
import { ZyraThemeService } from './theme-service';

describe('ZyraThemeService', () => {
    const originalMatchMedia = window.matchMedia;

    function mockMatchMedia(matches: boolean): void {
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            writable: true,
            value: jasmine.createSpy('matchMedia').and.callFake(() => ({
                matches,
                media: '(prefers-color-scheme: dark)',
                onchange: null,
                addEventListener: jasmine.createSpy('addEventListener'),
                removeEventListener: jasmine.createSpy('removeEventListener'),
                addListener: jasmine.createSpy('addListener'),
                removeListener: jasmine.createSpy('removeListener'),
                dispatchEvent: jasmine.createSpy('dispatchEvent'),
            })),
        });
    }

    function cleanupDom(): void {
        const root = document.documentElement;
        root.removeAttribute('data-theme');
        root.removeAttribute('data-zyra-theme');
        root.classList.remove('zyra-theme-dark', 'zyra-theme-light');
        root.style.colorScheme = '';
    }

    afterEach(() => {
        localStorage.removeItem('zyra-theme');
        localStorage.removeItem('zyra-theme-test');
        cleanupDom();
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            writable: true,
            value: originalMatchMedia,
        });
        TestBed.resetTestingModule();
    });

    it('initializes from stored theme and applies DOM markers', () => {
        localStorage.setItem('zyra-theme-test', 'dark');
        mockMatchMedia(false);

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ZYRA_CONFIG,
                    useValue: { storageKey: 'zyra-theme-test', theme: 'light' },
                },
            ],
        });

        const service = TestBed.inject(ZyraThemeService);
        TestBed.flushEffects();

        expect(service.theme()).toBe('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(document.documentElement.classList.contains('zyra-theme-dark')).toBeTrue();
    });

    it('toggles theme and persists the user choice', () => {
        mockMatchMedia(false);

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ZYRA_CONFIG,
                    useValue: {
                        storageKey: 'zyra-theme-test',
                        theme: 'light',
                        respectSystemTheme: false,
                    },
                },
            ],
        });

        const service = TestBed.inject(ZyraThemeService);
        service.toggle();
        TestBed.flushEffects();

        expect(service.theme()).toBe('dark');
        expect(localStorage.getItem('zyra-theme-test')).toBe('dark');
        expect(document.documentElement.style.colorScheme).toBe('dark');
    });

    it('clears stored theme and falls back to the system preference', () => {
        localStorage.setItem('zyra-theme-test', 'light');
        mockMatchMedia(true);

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ZYRA_CONFIG,
                    useValue: { storageKey: 'zyra-theme-test', theme: 'light' },
                },
            ],
        });

        const service = TestBed.inject(ZyraThemeService);
        service.clearStoredTheme();
        TestBed.flushEffects();

        expect(localStorage.getItem('zyra-theme-test')).toBeNull();
        expect(service.theme()).toBe('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { About } from './about';

describe('About', () => {
    let component: About;
    let fixture: ComponentFixture<About>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [About],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(About);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── stats data integrity ──────────────────────────────────────────────────
    it('exposes 4 stats', () => {
        expect(component.stats.length).toBe(4);
    });

    it('first stat value is "22" (component count)', () => {
        expect(component.stats[0].value).toBe('22');
    });

    it('first stat label is "Components"', () => {
        expect(component.stats[0].label).toBe('Components');
    });

    it('stats include the MIT license entry', () => {
        const mit = component.stats.find((s) => s.label === 'License');
        expect(mit?.value).toBe('MIT');
    });

    it('stats include Angular version v21', () => {
        const angular = component.stats.find((s) => s.label === 'Angular');
        expect(angular?.value).toBe('v21');
    });

    it('stats include 100% signals-first entry', () => {
        const signals = component.stats.find((s) => s.label === 'Signals-first');
        expect(signals?.value).toBe('100%');
    });

    // ── values (feature cards) ────────────────────────────────────────────────
    it('exposes 5 core values', () => {
        expect(component.values.length).toBe(5);
    });

    it('first value is "Token-first design"', () => {
        expect(component.values[0].title).toBe('Token-first design');
    });

    it('values include an accessibility entry', () => {
        const a11y = component.values.find((v) => v.title === 'Accessibility built in');
        expect(a11y).toBeTruthy();
    });
});

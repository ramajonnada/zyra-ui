import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsInstallation } from './installation';

describe('DocsInstallation', () => {
    let component: DocsInstallation;
    let fixture: ComponentFixture<DocsInstallation>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocsInstallation],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(DocsInstallation);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('exposes 4 install steps', () => {
        expect(component.installSteps.length).toBe(4);
    });

    it('first step covers package installation', () => {
        expect(component.installSteps[0].title).toContain('Install');
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
});

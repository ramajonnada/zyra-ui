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

    it('links out to installation, components, theming and theme tokens', () => {
        const routes = component.nextLinks.map((link) => link.route);
        expect(routes).toContain('/docs/installation');
        expect(routes).toContain('/docs/components');
        expect(routes).toContain('/docs/theming');
        expect(routes).toContain('/docs/theme-tokens');
    });
});

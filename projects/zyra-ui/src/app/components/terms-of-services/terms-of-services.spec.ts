import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfServices } from './terms-of-services';

describe('TermsOfServices', () => {
    let component: TermsOfServices;
    let fixture: ComponentFixture<TermsOfServices>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TermsOfServices],
        }).compileComponents();

        fixture = TestBed.createComponent(TermsOfServices);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

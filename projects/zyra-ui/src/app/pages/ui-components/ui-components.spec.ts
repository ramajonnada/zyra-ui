import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UiComponents } from './ui-components';

describe('UiComponents', () => {
    let component: UiComponents;
    let fixture: ComponentFixture<UiComponents>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiComponents],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(UiComponents);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

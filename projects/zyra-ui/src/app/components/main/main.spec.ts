import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Main } from './main';

describe('Main', () => {
    let component: Main;
    let fixture: ComponentFixture<Main>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Main],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(Main);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

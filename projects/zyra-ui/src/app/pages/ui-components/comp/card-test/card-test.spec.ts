import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTest } from './card-test';

describe('CardTest', () => {
    let component: CardTest;
    let fixture: ComponentFixture<CardTest>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardTest],
        }).compileComponents();

        fixture = TestBed.createComponent(CardTest);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

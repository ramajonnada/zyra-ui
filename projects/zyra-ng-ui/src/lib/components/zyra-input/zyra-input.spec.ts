import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraInput } from './zyra-input';

describe('ZyraInput', () => {
    let component: ZyraInput;
    let fixture: ComponentFixture<ZyraInput>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZyraInput],
        }).compileComponents();

        fixture = TestBed.createComponent(ZyraInput);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

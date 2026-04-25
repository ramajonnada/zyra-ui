import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraTooltip } from './zyra-tooltip';

describe('ZyraTooltip', () => {
    let component: ZyraTooltip;
    let fixture: ComponentFixture<ZyraTooltip>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZyraTooltip],
        }).compileComponents();

        fixture = TestBed.createComponent(ZyraTooltip);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraAvatar } from './zyra-avatar';

describe('ZyraAvatar', () => {
    let component: ZyraAvatar;
    let fixture: ComponentFixture<ZyraAvatar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZyraAvatar],
        }).compileComponents();

        fixture = TestBed.createComponent(ZyraAvatar);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

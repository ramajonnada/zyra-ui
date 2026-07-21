import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AnnouncementBar } from './announcement-bar';

describe('AnnouncementBar', () => {
    let fixture: ComponentFixture<AnnouncementBar>;
    let component: AnnouncementBar;

    beforeEach(async () => {
        localStorage.clear();

        await TestBed.configureTestingModule({
            imports: [AnnouncementBar],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(AnnouncementBar);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('creates', () => {
        expect(component).toBeTruthy();
    });

    it('is visible by default when nothing was previously dismissed', () => {
        expect(component.visible()).toBeTrue();
        expect(fixture.nativeElement.querySelector('.ann-bar')).not.toBeNull();
    });

    it('hides and persists dismissal to localStorage when closed', () => {
        component.dismiss();
        fixture.detectChanges();

        expect(component.visible()).toBeFalse();
        expect(fixture.nativeElement.querySelector('.ann-bar')).toBeNull();
        expect(localStorage.getItem(`zyra-announcement-dismissed-${component.highlight.id}`)).toBe('true');
    });

    it('stays hidden on a fresh instance if already dismissed for this highlight', () => {
        localStorage.setItem(`zyra-announcement-dismissed-${component.highlight.id}`, 'true');

        const secondFixture = TestBed.createComponent(AnnouncementBar);
        secondFixture.detectChanges();

        expect(secondFixture.componentInstance.visible()).toBeFalse();
    });

    it('close button has an accessible label', () => {
        const btn: HTMLElement = fixture.nativeElement.querySelector('.ann-bar__close');
        expect(btn.getAttribute('aria-label')).toBeTruthy();
    });
});

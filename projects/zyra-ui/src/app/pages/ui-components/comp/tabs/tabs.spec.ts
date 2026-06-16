import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabs } from './tabs';

describe('Tabs demo', () => {
    let fixture: ComponentFixture<Tabs>;
    let component: Tabs;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Tabs] }).compileComponents();
        fixture = TestBed.createComponent(Tabs);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has activeTab defaulting to empty string', () => {
        expect(component.activeTab()).toBe('');
    });

    it('updates activeTab signal', () => {
        component.activeTab.set('overview');
        expect(component.activeTab()).toBe('overview');
    });

    it('activeTab can be set to any string value', () => {
        component.activeTab.set('settings');
        expect(component.activeTab()).toBe('settings');
    });
});

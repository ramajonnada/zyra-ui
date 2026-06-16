import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Skeleton } from './skeleton';

describe('Skeleton demo', () => {
    let fixture: ComponentFixture<Skeleton>;
    let component: Skeleton;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Skeleton] }).compileComponents();
        fixture = TestBed.createComponent(Skeleton);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has animated defaulting to true', () => {
        expect(component.animated()).toBeTrue();
    });

    it('updates animated signal to false', () => {
        component.animated.set(false);
        expect(component.animated()).toBeFalse();
    });

    it('updates animated signal back to true', () => {
        component.animated.set(false);
        component.animated.set(true);
        expect(component.animated()).toBeTrue();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spinner } from './spinner';

describe('Spinner demo', () => {
    let fixture: ComponentFixture<Spinner>;
    let component: Spinner;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Spinner] }).compileComponents();
        fixture = TestBed.createComponent(Spinner);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.size()).toBe('md');
        expect(component.color()).toBe('accent');
        expect(component.label()).toBe('Loading...');
        expect(component.btn1Loading()).toBeFalse();
        expect(component.btn2Loading()).toBeFalse();
        expect(component.btn3Loading()).toBeFalse();
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates color signal', () => {
        component.color.set('white');
        expect(component.color()).toBe('white');
    });

    it('updates label signal', () => {
        component.label.set('Please wait');
        expect(component.label()).toBe('Please wait');
    });

    it('generatedCode includes size and color', () => {
        const code = component.generatedCode();
        expect(code).toContain('size="md"');
        expect(code).toContain('color="accent"');
    });

    it('generatedCode includes label when set', () => {
        component.label.set('Fetching data');
        expect(component.generatedCode()).toContain('label="Fetching data"');
    });

    it('generatedCode self-closes when label is empty', () => {
        component.label.set('');
        expect(component.generatedCode()).toContain('/>');
    });

    it('reset() restores defaults', () => {
        component.size.set('lg');
        component.color.set('white');
        component.label.set('Wait...');
        component.reset();
        expect(component.size()).toBe('md');
        expect(component.color()).toBe('accent');
        expect(component.label()).toBe('Loading...');
    });

    it('has expected sizes list', () => {
        expect(component.sizes).toEqual(['xs', 'sm', 'md', 'lg']);
    });

    it('has expected colors list', () => {
        expect(component.colors).toContain('accent');
        expect(component.colors).toContain('white');
    });
});

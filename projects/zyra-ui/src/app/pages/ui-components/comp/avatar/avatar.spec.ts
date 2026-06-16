import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Avatar } from './avatar';

describe('Avatar demo', () => {
    let fixture: ComponentFixture<Avatar>;
    let component: Avatar;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Avatar] }).compileComponents();
        fixture = TestBed.createComponent(Avatar);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.name()).toBe('Arjun Kumar');
        expect(component.size()).toBe('md');
        expect(component.variant()).toBe('teal');
        expect(component.square()).toBeFalse();
        expect(component.online()).toBeNull();
        expect(component.src()).toBe('');
    });

    it('updates name signal', () => {
        component.name.set('Priya Sharma');
        expect(component.name()).toBe('Priya Sharma');
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates variant signal', () => {
        component.variant.set('purple');
        expect(component.variant()).toBe('purple');
    });

    it('updates square signal', () => {
        component.square.set(true);
        expect(component.square()).toBeTrue();
    });

    it('updates online signal', () => {
        component.online.set(true);
        expect(component.online()).toBeTrue();
    });

    it('generatedCode includes name attribute', () => {
        expect(component.generatedCode()).toContain('name="Arjun Kumar"');
    });

    it('generatedCode includes size and variant', () => {
        const code = component.generatedCode();
        expect(code).toContain('size="md"');
        expect(code).toContain('variant="teal"');
    });

    it('generatedCode includes [square]="true" when square is set', () => {
        component.square.set(true);
        expect(component.generatedCode()).toContain('[square]="true"');
    });

    it('generatedCode includes [online] when set', () => {
        component.online.set(false);
        expect(component.generatedCode()).toContain('[online]="false"');
    });

    it('generatedCode does not include [online] when null', () => {
        expect(component.generatedCode()).not.toContain('[online]');
    });

    it('reset() restores all default signal values', () => {
        component.name.set('Other');
        component.size.set('xl');
        component.variant.set('blue');
        component.square.set(true);
        component.online.set(true);
        component.reset();
        expect(component.name()).toBe('Arjun Kumar');
        expect(component.size()).toBe('md');
        expect(component.variant()).toBe('teal');
        expect(component.square()).toBeFalse();
        expect(component.online()).toBeNull();
    });

    it('has the expected sample names list', () => {
        expect(component.sampleNames).toContain('Arjun Kumar');
        expect(component.sampleNames.length).toBeGreaterThan(0);
    });
});

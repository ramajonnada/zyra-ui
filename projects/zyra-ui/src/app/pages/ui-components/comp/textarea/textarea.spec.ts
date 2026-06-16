import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Textarea } from './textarea';

describe('Textarea demo', () => {
    let fixture: ComponentFixture<Textarea>;
    let component: Textarea;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Textarea] }).compileComponents();
        fixture = TestBed.createComponent(Textarea);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.size()).toBe('md');
        expect(component.resize()).toBe('vertical');
        expect(component.rows()).toBe(3);
        expect(component.placeholder()).toBe('Enter your message...');
        expect(component.playValue()).toBe('');
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates resize signal', () => {
        component.resize.set('none');
        expect(component.resize()).toBe('none');
    });

    it('updates rows signal', () => {
        component.rows.set(5);
        expect(component.rows()).toBe(5);
    });

    it('updates placeholder signal', () => {
        component.placeholder.set('Type here...');
        expect(component.placeholder()).toBe('Type here...');
    });

    it('generatedCode is minimal for defaults', () => {
        const code = component.generatedCode();
        expect(code).toContain('zyra-textarea');
        expect(code).not.toContain('size=');
        expect(code).not.toContain('resize=');
    });

    it('generatedCode includes size when not md', () => {
        component.size.set('sm');
        expect(component.generatedCode()).toContain('size="sm"');
    });

    it('generatedCode includes resize when not vertical', () => {
        component.resize.set('auto');
        expect(component.generatedCode()).toContain('resize="auto"');
    });

    it('generatedCode includes rows when not 3', () => {
        component.rows.set(6);
        expect(component.generatedCode()).toContain('[rows]="6"');
    });

    it('generatedCode includes placeholder when changed', () => {
        component.placeholder.set('Write here');
        expect(component.generatedCode()).toContain('placeholder="Write here"');
    });

    it('bioCtrl has maxLength validation of 200', () => {
        component.bioCtrl.setValue('a'.repeat(201));
        expect(component.bioCtrl.errors?.['maxlength']).toBeTruthy();
    });

    it('bioCtrl is valid within limit', () => {
        component.bioCtrl.setValue('a'.repeat(200));
        expect(component.bioCtrl.valid).toBeTrue();
    });

    it('reset() restores all defaults', () => {
        component.size.set('lg');
        component.resize.set('none');
        component.rows.set(8);
        component.playValue.set('some text');
        component.reset();
        expect(component.size()).toBe('md');
        expect(component.resize()).toBe('vertical');
        expect(component.rows()).toBe(3);
        expect(component.playValue()).toBe('');
    });
});

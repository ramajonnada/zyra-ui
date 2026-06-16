import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from './form-field';

describe('FormField demo', () => {
    let fixture: ComponentFixture<FormField>;
    let component: FormField;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [FormField] }).compileComponents();
        fixture = TestBed.createComponent(FormField);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has loading signal defaulting to false', () => {
        expect(component.loading()).toBeFalse();
    });

    it('updates loading signal', () => {
        component.loading.set(true);
        expect(component.loading()).toBeTrue();
    });

    it('has required validation on requiredCtrl', () => {
        component.requiredCtrl.setValue('');
        expect(component.requiredCtrl.invalid).toBeTrue();
        expect(component.requiredCtrl.errors?.['required']).toBeTrue();
    });

    it('requiredCtrl is valid when value is set', () => {
        component.requiredCtrl.setValue('something');
        expect(component.requiredCtrl.valid).toBeTrue();
    });

    it('emailCtrl is invalid for bad email', () => {
        component.emailCtrl.setValue('notanemail');
        expect(component.emailCtrl.errors?.['email']).toBeTruthy();
    });

    it('emailCtrl is valid for correct email', () => {
        component.emailCtrl.setValue('user@example.com');
        expect(component.emailCtrl.valid).toBeTrue();
    });

    it('minLenCtrl is invalid when too short', () => {
        component.minLenCtrl.setValue('abc');
        expect(component.minLenCtrl.errors?.['minlength']).toBeTruthy();
    });

    it('minLenCtrl is valid when long enough', () => {
        component.minLenCtrl.setValue('abcdef');
        expect(component.minLenCtrl.valid).toBeTrue();
    });

    it('maxLenCtrl is invalid when too long', () => {
        component.maxLenCtrl.setValue('a'.repeat(21));
        expect(component.maxLenCtrl.errors?.['maxlength']).toBeTruthy();
    });

    it('bioCtrl maxLength is 160', () => {
        component.bioCtrl.setValue('a'.repeat(161));
        expect(component.bioCtrl.errors?.['maxlength']).toBeTruthy();
    });

    it('contactForm has all required controls', () => {
        expect(component.contactForm.get('name')).not.toBeNull();
        expect(component.contactForm.get('email')).not.toBeNull();
        expect(component.contactForm.get('subject')).not.toBeNull();
        expect(component.contactForm.get('message')).not.toBeNull();
    });

    it('contactForm is invalid when empty', () => {
        expect(component.contactForm.invalid).toBeTrue();
    });

    it('submit() marks all controls as touched when form is invalid', () => {
        component.submit();
        expect(component.contactForm.get('name')?.touched).toBeTrue();
        expect(component.contactForm.get('email')?.touched).toBeTrue();
    });

    it('contactForm is valid with all required values', () => {
        component.contactForm.setValue({
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Hello',
            message: 'This is a message that is long enough.',
        });
        expect(component.contactForm.valid).toBeTrue();
    });
});

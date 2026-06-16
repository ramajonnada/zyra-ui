import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input } from './input';

describe('Input demo', () => {
    let fixture: ComponentFixture<Input>;
    let component: Input;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Input] }).compileComponents();
        fixture = TestBed.createComponent(Input);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('creates successfully', () => expect(component).toBeTruthy());

    it('has correct default signal values', () => {
        expect(component.type()).toBe('text');
        expect(component.size()).toBe('md');
        expect(component.appearance()).toBe('outline');
        expect(component.clearButton()).toBeFalse();
        expect(component.loading()).toBeFalse();
        expect(component.maxLen()).toBeNull();
        expect(component.hintText()).toBe('This is a hint message');
        expect(component.successHint()).toBe('Looks great!');
    });

    it('updates type signal', () => {
        component.type.set('email');
        expect(component.type()).toBe('email');
    });

    it('updates size signal', () => {
        component.size.set('lg');
        expect(component.size()).toBe('lg');
    });

    it('updates appearance signal', () => {
        component.appearance.set('filled');
        expect(component.appearance()).toBe('filled');
    });

    it('updates clearButton signal', () => {
        component.clearButton.set(true);
        expect(component.clearButton()).toBeTrue();
    });

    it('updates loading signal', () => {
        component.loading.set(true);
        expect(component.loading()).toBeTrue();
    });

    it('generatedCode includes type', () => {
        expect(component.generatedCode()).toContain('type="text"');
    });

    it('generatedCode includes appearance', () => {
        component.appearance.set('filled');
        expect(component.generatedCode()).toContain('appearance="filled"');
    });

    it('generatedCode includes [clearButton]="true" when enabled', () => {
        component.clearButton.set(true);
        expect(component.generatedCode()).toContain('[clearButton]="true"');
    });

    it('loginForm has email and password controls', () => {
        expect(component.loginForm.get('email')).not.toBeNull();
        expect(component.loginForm.get('password')).not.toBeNull();
    });

    it('loginForm is invalid when empty', () => {
        expect(component.loginForm.invalid).toBeTrue();
    });

    it('loginForm is valid with proper values', () => {
        component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
        expect(component.loginForm.valid).toBeTrue();
    });

    it('onValueChange() appends to eventLog', () => {
        component.onValueChange('hello', 'Username');
        expect(component.eventLog().length).toBe(1);
        expect(component.eventLog()[0].msg).toContain('Username');
    });

    it('onBlur() appends blur event to eventLog', () => {
        component.onBlur('Email');
        expect(component.eventLog()[0].event).toBe('blurred');
        expect(component.eventLog()[0].msg).toBe('Email');
    });

    it('reset() restores defaults', () => {
        component.type.set('email');
        component.size.set('lg');
        component.clearButton.set(true);
        component.loading.set(true);
        component.reset();
        expect(component.type()).toBe('text');
        expect(component.size()).toBe('md');
        expect(component.clearButton()).toBeFalse();
        expect(component.loading()).toBeFalse();
        expect(component.eventLog()).toEqual([]);
    });

    it('playgroundControl updates when type changes', () => {
        component.type.set('email');
        const ctrl = component.playgroundControl();
        expect(ctrl).not.toBeNull();
    });

    it('has expected types list', () => {
        expect(component.types).toContain('text');
        expect(component.types).toContain('email');
        expect(component.types).toContain('password');
    });
});

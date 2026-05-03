import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ZyraFormField } from './zyra-form-field';
import { ZyraInput, InputType } from '../zyra-input/zyra-input';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraFormField, ZyraInput],
    template: `
        <zyra-form-field
            [label]="label"
            [hint]="hint"
            [successHint]="successHint"
            [clearButton]="clearButton"
            [maxLength]="maxLength"
        >
            <zyra-input [(ngModel)]="value" [type]="type" required></zyra-input>
        </zyra-form-field>
    `,
})
class FormFieldHostComponent {
    label = 'Account password';
    hint = 'Use a strong password';
    successHint = 'Looks good';
    clearButton = false;
    maxLength = 10;
    value = 'secret';
    type: InputType = 'password';
}

describe('ZyraFormField', () => {
    let fixture: ComponentFixture<FormFieldHostComponent>;
    let host: FormFieldHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FormFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('renders label, required marker, and counter', () => {
        const label: HTMLLabelElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__label',
        );
        const counter: HTMLElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__counter',
        );

        expect(label.textContent).toContain('Account password');
        expect(label.textContent).toContain('*');
        expect(counter.textContent?.trim()).toBe('6 / 10');
    });

    it('toggles password visibility from the suffix control', () => {
        const toggle: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__icon-btn',
        );
        toggle.click();
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(input.type).toBe('text');
    });

    it('clears the value when the clear button is enabled for text input', async () => {
        host.type = 'text';
        host.clearButton = true;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const clearButton: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyra-form-field__clear-btn',
        );
        clearButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value).toBe('');
        expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe('');
    });
});

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ZyraOption } from '../zyra-select/zyra-option';
import { ZyraAutocomplete } from './zyra-autocomplete';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraAutocomplete, ZyraOption],
    template: `
        <zyra-autocomplete
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            [placeholder]="placeholder()"
        >
            <zyra-option value="angular">Angular</zyra-option>
            <zyra-option value="react">React</zyra-option>
            <zyra-option value="vue" [disabled]="true">Vue</zyra-option>
        </zyra-autocomplete>
    `,
})
class AutocompleteHostComponent {
    value = signal<string | null>(null);
    placeholder = signal('Search…');
}

function input(fixture: ComponentFixture<unknown>): HTMLInputElement {
    return fixture.nativeElement.querySelector('.zyr-autocomplete__input');
}

function visibleOptions(fixture: ComponentFixture<unknown>): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.zyr-option')).filter(
        (el) => !(el as HTMLElement).hidden,
    ) as HTMLElement[];
}

describe('ZyraAutocomplete', () => {
    let fixture: ComponentFixture<AutocompleteHostComponent>;
    let host: AutocompleteHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutocompleteHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(AutocompleteHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('shows the placeholder when empty', () => {
        expect(input(fixture).placeholder).toBe('Search…');
        expect(input(fixture).value).toBe('');
    });

    it('opens the panel on focus', () => {
        input(fixture).dispatchEvent(new Event('focus'));
        fixture.detectChanges();

        expect(
            fixture.nativeElement.querySelector('.zyr-autocomplete__panel--open'),
        ).not.toBeNull();
    });

    it('filters options as the query is typed', () => {
        const el = input(fixture);
        el.value = 'rea';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const visible = visibleOptions(fixture);
        expect(visible.length).toBe(1);
        expect(visible[0].textContent?.trim()).toBe('React');
    });

    it('shows the no-results message when nothing matches', () => {
        const el = input(fixture);
        el.value = 'nothingmatches';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-autocomplete__empty')).not.toBeNull();
    });

    it('selects an option on click, closes the panel, and fills the input', () => {
        const el = input(fixture);
        el.value = 'ang';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const opt = visibleOptions(fixture)[0];
        opt.click();
        fixture.detectChanges();

        expect(host.value()).toBe('angular');
        expect(input(fixture).value).toBe('Angular');
        expect(
            fixture.nativeElement.querySelector('.zyr-autocomplete__panel--open'),
        ).toBeNull();
    });

    it('selects the active option on Enter', () => {
        input(fixture).dispatchEvent(new Event('focus'));
        fixture.detectChanges();

        input(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();

        expect(host.value()).toBe('angular');
    });

    it('moves the active option with ArrowDown', () => {
        input(fixture).dispatchEvent(new Event('focus'));
        fixture.detectChanges();

        input(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        input(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();

        expect(host.value()).toBe('react');
    });

    it('reverts the query to the selected label on blur without a match', async () => {
        host.value.set('angular');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const el = input(fixture);
        el.value = 'gibberish';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        el.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(input(fixture).value).toBe('Angular');
    });

    it('closes on Escape', () => {
        input(fixture).dispatchEvent(new Event('focus'));
        fixture.detectChanges();

        input(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-autocomplete__panel--open')).toBeNull();
    });

    it('has role="combobox" on the input and role="listbox" on the panel', () => {
        expect(input(fixture).getAttribute('role')).toBe('combobox');
        expect(fixture.nativeElement.querySelector('[role="listbox"]')).not.toBeNull();
    });
});

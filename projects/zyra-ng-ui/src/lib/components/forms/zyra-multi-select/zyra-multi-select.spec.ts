import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ZyraOption } from '../zyra-select/zyra-option';
import { ZyraMultiSelect } from './zyra-multi-select';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraMultiSelect, ZyraOption],
    template: `
        <zyra-multi-select
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            [placeholder]="placeholder()"
        >
            <zyra-option value="angular">Angular</zyra-option>
            <zyra-option value="react">React</zyra-option>
            <zyra-option value="vue" [disabled]="true">Vue</zyra-option>
        </zyra-multi-select>
    `,
})
class MultiSelectHostComponent {
    value = signal<(string | number)[]>([]);
    placeholder = signal('Select options');
}

function trigger(fixture: ComponentFixture<unknown>): HTMLElement {
    return fixture.nativeElement.querySelector('.zyr-multi-select__trigger');
}

function options(fixture: ComponentFixture<unknown>): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('.zyr-option');
}

describe('ZyraMultiSelect', () => {
    let fixture: ComponentFixture<MultiSelectHostComponent>;
    let host: MultiSelectHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MultiSelectHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(MultiSelectHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('shows placeholder when nothing is selected', () => {
        const value: HTMLElement = fixture.nativeElement.querySelector(
            '.zyr-multi-select__value--placeholder',
        );
        expect(value.textContent?.trim()).toBe('Select options');
    });

    it('opens the panel on trigger click', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector('.zyr-multi-select__panel--open'),
        ).not.toBeNull();
    });

    it('adds a value when an option is clicked, without closing the panel', () => {
        trigger(fixture).click();
        fixture.detectChanges();

        options(fixture)[0].click();
        fixture.detectChanges();

        expect(host.value()).toEqual(['angular']);
        expect(
            fixture.nativeElement.querySelector('.zyr-multi-select__panel--open'),
        ).not.toBeNull();
    });

    it('toggles a value off when its option is clicked again', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        options(fixture)[0].click();
        fixture.detectChanges();
        options(fixture)[0].click();
        fixture.detectChanges();

        expect(host.value()).toEqual([]);
    });

    it('accumulates multiple selected values', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        options(fixture)[0].click();
        fixture.detectChanges();
        options(fixture)[1].click();
        fixture.detectChanges();

        expect(host.value()).toEqual(['angular', 'react']);
    });

    it('renders a chip per selected value', async () => {
        host.value.set(['angular', 'react']);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const chips = fixture.nativeElement.querySelectorAll('zyra-chip');
        expect(chips.length).toBe(2);
    });

    it('removes a value when its chip is dismissed', async () => {
        host.value.set(['angular', 'react']);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const dismissBtn: HTMLButtonElement =
            fixture.nativeElement.querySelector('zyra-chip .zyr-chip__dismiss');
        dismissBtn.click();
        fixture.detectChanges();

        expect(host.value()).toEqual(['react']);
    });

    it('does not select a disabled option', () => {
        trigger(fixture).click();
        fixture.detectChanges();

        options(fixture)[2].click();
        fixture.detectChanges();

        expect(host.value()).toEqual([]);
    });

    it('has role="listbox" with aria-multiselectable="true"', () => {
        const panel: HTMLElement = fixture.nativeElement.querySelector('[role="listbox"]');
        expect(panel.getAttribute('aria-multiselectable')).toBe('true');
    });
});

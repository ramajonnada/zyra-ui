import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ZyraOption } from './zyra-option';
import { ZyraSelect } from './zyra-select';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraSelect, ZyraOption],
    template: `
        <zyra-select [(ngModel)]="value" [placeholder]="placeholder()" [size]="size()">
            <zyra-option value="angular">Angular</zyra-option>
            <zyra-option value="react">React</zyra-option>
            <zyra-option value="vue" [disabled]="true">Vue</zyra-option>
        </zyra-select>
    `,
})
class SelectHostComponent {
    value = signal<string | null>(null);
    placeholder = signal('Pick one');
    size = signal<'sm' | 'md' | 'lg'>('md');
}

describe('ZyraSelect', () => {
    let fixture: ComponentFixture<SelectHostComponent>;
    let host: SelectHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(SelectHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    // ── Placeholder ───────────────────────────────────────────────────────
    it('shows placeholder when no value is selected', () => {
        const value: HTMLElement = fixture.nativeElement.querySelector('.zyr-select__value');
        expect(value.textContent?.trim()).toBe('Pick one');
        expect(value.classList).toContain('zyr-select__value--placeholder');
    });

    it('shows custom placeholder text', () => {
        host.placeholder.set('Choose a framework');
        fixture.detectChanges();
        const value: HTMLElement = fixture.nativeElement.querySelector('.zyr-select__value');
        expect(value.textContent?.trim()).toBe('Choose a framework');
    });

    // ── Panel open/close ──────────────────────────────────────────────────
    it('opens the panel on trigger click', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-select__panel--open')).not.toBeNull();
    });

    it('closes the panel on a second trigger click', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        trigger(fixture).click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-select__panel--open')).toBeNull();
    });

    it('closes the panel after selecting an option', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        options(fixture)[0].click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-select__panel--open')).toBeNull();
    });

    // ── Selection ─────────────────────────────────────────────────────────
    it('updates the bound value when an option is selected', async () => {
        trigger(fixture).click();
        fixture.detectChanges();
        options(fixture)[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(host.value()).toBe('angular');
    });

    it('displays the selected option label in the trigger', async () => {
        trigger(fixture).click();
        fixture.detectChanges();
        options(fixture)[1].click(); // React
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const valueEl: HTMLElement = fixture.nativeElement.querySelector('.zyr-select__value');
        expect(valueEl.textContent?.trim()).toBe('React');
        expect(valueEl.classList).not.toContain('zyr-select__value--placeholder');
    });

    it('does not select a disabled option', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        options(fixture)[2].click(); // Vue (disabled)
        fixture.detectChanges();
        expect(host.value()).toBeNull();
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('opens panel on ArrowDown and navigates to first option', () => {
        selectEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-select__panel--open')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-option--active')).not.toBeNull();
    });

    it('closes the panel on Escape key', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        selectEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
        );
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-select__panel--open')).toBeNull();
    });

    it('navigates down through options with ArrowDown', () => {
        selectEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();
        selectEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();
        const activeOpts: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll('.zyr-option--active');
        expect(activeOpts.length).toBe(1);
    });

    it('selects the active option on Enter', async () => {
        selectEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
        );
        fixture.detectChanges();
        selectEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
        );
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(host.value()).toBe('angular');
        expect(fixture.nativeElement.querySelector('.zyr-select__panel--open')).toBeNull();
    });

    it('closes panel on Tab key', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        selectEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
        );
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-select__panel--open')).toBeNull();
    });

    // ── Size ──────────────────────────────────────────────────────────────
    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-select--md')).not.toBeNull();
    });

    it('applies lg size class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-select--lg')).not.toBeNull();
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('trigger has aria-haspopup="listbox" and reflects aria-expanded', () => {
        const btn: HTMLButtonElement = trigger(fixture);
        expect(btn.getAttribute('aria-haspopup')).toBe('listbox');
        expect(btn.getAttribute('aria-expanded')).toBe('false');

        btn.click();
        fixture.detectChanges();
        expect(btn.getAttribute('aria-expanded')).toBe('true');
    });

    it('each option has role="option"', () => {
        trigger(fixture).click();
        fixture.detectChanges();
        const roleOpts: NodeList = fixture.nativeElement.querySelectorAll('[role="option"]');
        expect(roleOpts.length).toBe(3);
    });
});

function trigger(f: ComponentFixture<SelectHostComponent>): HTMLButtonElement {
    return f.nativeElement.querySelector('.zyr-select__trigger');
}

function options(f: ComponentFixture<SelectHostComponent>): NodeListOf<HTMLElement> {
    return f.nativeElement.querySelectorAll('.zyr-option');
}

function selectEl(f: ComponentFixture<SelectHostComponent>): HTMLElement {
    return f.nativeElement.querySelector('zyra-select');
}

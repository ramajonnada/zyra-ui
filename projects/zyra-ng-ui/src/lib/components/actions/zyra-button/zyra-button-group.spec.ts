import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ZyraButton } from './zyra-button';
import { ZyraButtonGroup, ButtonGroupValue } from './zyra-button-group';
import { ButtonGroupSelectionMode } from './zyra-button-group-token';

@Component({
    standalone: true,
    imports: [FormsModule, ZyraButtonGroup, ZyraButton],
    template: `
        <zyra-button-group
            [orientation]="orientation()"
            [join]="join()"
            [disabled]="groupDisabled()"
            [size]="size()"
            [variant]="variant()"
            [selectionMode]="selectionMode()"
            [allowEmptySelection]="allowEmptySelection()"
            [fullWidth]="fullWidth()"
            [equalWidth]="equalWidth()"
            [(value)]="value"
            aria-label="Text alignment"
        >
            <zyra-button value="left">Left</zyra-button>
            <zyra-button value="center">Center</zyra-button>
            <zyra-button value="right" [disabled]="true">Right</zyra-button>
        </zyra-button-group>
    `,
})
class ButtonGroupHostComponent {
    orientation = signal<'horizontal' | 'vertical'>('horizontal');
    join = signal<'attached' | 'separated'>('separated');
    groupDisabled = signal(false);
    size = signal<'sm' | 'md' | 'lg' | undefined>(undefined);
    variant = signal<'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | undefined>(undefined);
    selectionMode = signal<ButtonGroupSelectionMode>('single');
    allowEmptySelection = signal(false);
    fullWidth = signal(false);
    equalWidth = signal(false);
    value = signal<ButtonGroupValue>(null);
}

describe('ZyraButtonGroup', () => {
    let fixture: ComponentFixture<ButtonGroupHostComponent>;
    let host: ButtonGroupHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonGroupHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(ButtonGroupHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    });

    // ── Rendering ─────────────────────────────────────────────────────────
    it('renders all buttons', () => {
        expect(fixture.nativeElement.querySelectorAll('zyra-button').length).toBe(3);
    });

    // ── Layout ────────────────────────────────────────────────────────────
    it('applies orientation class', () => {
        expect(fixture.nativeElement.querySelector('.zyr-btn-group--horizontal')).not.toBeNull();
        host.orientation.set('vertical');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn-group--vertical')).not.toBeNull();
    });

    it('applies join class', () => {
        expect(fixture.nativeElement.querySelector('.zyr-btn-group--separated')).not.toBeNull();
        host.join.set('attached');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn-group--attached')).not.toBeNull();
    });

    it('does not apply --full or --equal classes by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-btn-group--full')).toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-btn-group--equal')).toBeNull();
    });

    it('applies --equal class and gives every button equal rendered width without stretching the group', async () => {
        host.equalWidth.set(true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-btn-group--equal')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-btn-group--full')).toBeNull();

        const widths = buttons(fixture).map((b) => b.getBoundingClientRect().width);
        expect(widths[0]).toBeCloseTo(widths[1], 0);
        expect(widths[1]).toBeCloseTo(widths[2], 0);
    });

    it('applies --full class and stretches the group to its container', () => {
        host.fullWidth.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-btn-group--full')).not.toBeNull();
    });

    // ── Shared config inheritance/override ───────────────────────────────
    it('propagates size to children that do not set their own', () => {
        host.size.set('lg');
        fixture.detectChanges();
        const buttons: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.zyr-btn');
        buttons.forEach((b) => expect(b.classList).toContain('zyr-btn--lg'));
    });

    it('lets a child override the group size', async () => {
        @Component({
            standalone: true,
            imports: [ZyraButtonGroup, ZyraButton],
            template: `
                <zyra-button-group size="lg">
                    <zyra-button value="a">A</zyra-button>
                    <zyra-button value="b" size="sm">B</zyra-button>
                </zyra-button-group>
            `,
        })
        class OverrideHost {}

        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [OverrideHost] }).compileComponents();
        const f = TestBed.createComponent(OverrideHost);
        f.detectChanges();
        await f.whenStable();
        f.detectChanges();
        const buttons: NodeListOf<HTMLElement> = f.nativeElement.querySelectorAll('.zyr-btn');
        expect(buttons[0].classList).toContain('zyr-btn--lg');
        expect(buttons[1].classList).toContain('zyr-btn--sm');
    });

    it('propagates disabled to all children', () => {
        host.groupDisabled.set(true);
        fixture.detectChanges();
        const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
        buttons.forEach((b) => expect(b.disabled).toBeTrue());
    });

    // ── Selection: single ─────────────────────────────────────────────────
    it('selects a button on click in single mode and updates bound value', () => {
        buttons(fixture)[0].click();
        fixture.detectChanges();
        expect(host.value()).toBe('left');
    });

    it('marks the selected button with --selected class and aria-checked', () => {
        buttons(fixture)[1].click();
        fixture.detectChanges();
        const btns = buttons(fixture);
        expect(btns[1].classList).toContain('zyr-btn--selected');
        expect(btns[1].getAttribute('aria-checked')).toBe('true');
        expect(btns[0].getAttribute('aria-checked')).toBe('false');
    });

    it('switching selection deselects the previous button', () => {
        buttons(fixture)[0].click();
        fixture.detectChanges();
        buttons(fixture)[1].click();
        fixture.detectChanges();
        expect(buttons(fixture)[0].classList).not.toContain('zyr-btn--selected');
        expect(buttons(fixture)[1].classList).toContain('zyr-btn--selected');
    });

    it('does not select a disabled button', () => {
        buttons(fixture)[2].click();
        fixture.detectChanges();
        expect(host.value()).toBeNull();
    });

    it('clicking the selected button again is a no-op when allowEmptySelection is false', () => {
        buttons(fixture)[0].click();
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        expect(host.value()).toBe('left');
    });

    it('clicking the selected button again clears selection when allowEmptySelection is true', () => {
        host.allowEmptySelection.set(true);
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        expect(host.value()).toBeNull();
    });

    // ── Selection: multiple ───────────────────────────────────────────────
    it('accumulates multiple selected values in multiple mode', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        buttons(fixture)[1].click();
        fixture.detectChanges();
        expect(host.value()).toEqual(['left', 'center']);
    });

    it('toggles a value off in multiple mode when clicked again', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        expect(host.value()).toEqual([]);
    });

    // ── Selection: none ───────────────────────────────────────────────────
    it('does not track selection in "none" mode', () => {
        host.selectionMode.set('none');
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        expect(host.value()).toBeNull();
        expect(buttons(fixture)[0].classList).not.toContain('zyr-btn--selected');
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('moves selection forward on ArrowRight (horizontal)', async () => {
        buttons(fixture)[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
        );
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBe('center');
    });

    it('skips disabled buttons during arrow navigation and wraps', async () => {
        buttons(fixture)[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
        );
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        // 'right' is disabled, so it should wrap back to 'left'.
        expect(host.value()).toBe('left');
    });

    it('moves selection backward on ArrowLeft (horizontal)', async () => {
        buttons(fixture)[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBe('left');
    });

    it('moves selection with ArrowDown/ArrowUp when vertical', async () => {
        host.orientation.set('vertical');
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBe('center');
    });

    it('jumps to the first button on Home', async () => {
        buttons(fixture)[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(host.value()).toBe('left');
    });

    it('jumps to the last non-disabled button on End', async () => {
        buttons(fixture)[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        groupEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        // 'right' is disabled, so End should land on 'center'.
        expect(host.value()).toBe('center');
    });

    // ── Roving tabindex ───────────────────────────────────────────────────
    it('only one button is tabbable at a time', async () => {
        buttons(fixture)[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const tabbable = buttons(fixture).filter((b) => b.getAttribute('tabindex') === '0');
        expect(tabbable.length).toBe(1);
        expect(tabbable[0].textContent).toContain('Center');
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('has role="radiogroup" in single mode', () => {
        expect(fixture.nativeElement.querySelector('[role="radiogroup"]')).not.toBeNull();
    });

    it('has role="group" in multiple and none modes', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="group"]')).not.toBeNull();

        host.selectionMode.set('none');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="group"]')).not.toBeNull();
    });

    it('each button has role="radio" in single mode', () => {
        const roleRadios: NodeList = fixture.nativeElement.querySelectorAll('[role="radio"]');
        expect(roleRadios.length).toBe(3);
    });

    it('sets aria-pressed (not role=radio) in multiple mode', () => {
        host.selectionMode.set('multiple');
        fixture.detectChanges();
        buttons(fixture)[0].click();
        fixture.detectChanges();
        const btn = buttons(fixture)[0];
        expect(btn.getAttribute('role')).toBeNull();
        expect(btn.getAttribute('aria-pressed')).toBe('true');
    });

    it('has aria-label on the group', () => {
        expect(fixture.nativeElement.querySelector('zyra-button-group > div')?.getAttribute('aria-label')).toBe(
            'Text alignment',
        );
    });
});

function buttons(f: ComponentFixture<ButtonGroupHostComponent>): HTMLButtonElement[] {
    return Array.from(f.nativeElement.querySelectorAll('button'));
}

function groupEl(f: ComponentFixture<ButtonGroupHostComponent>): HTMLElement {
    return f.nativeElement.querySelector('zyra-button-group');
}

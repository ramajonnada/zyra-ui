import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraPopover } from './zyra-popover';

@Component({
    standalone: true,
    imports: [ZyraPopover],
    template: `
        <zyra-popover
            [position]="position()"
            [trigger]="trigger()"
            [closeOnOutsideClick]="closeOnOutsideClick()"
        >
            <button slot="trigger">Open</button>
            <div slot="content">Popover body</div>
        </zyra-popover>
        <button id="outside">Outside</button>
    `,
})
class PopoverHostComponent {
    position = signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
    trigger = signal<'click' | 'hover'>('click');
    closeOnOutsideClick = signal(true);
}

describe('ZyraPopover', () => {
    let fixture: ComponentFixture<PopoverHostComponent>;
    let host: PopoverHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopoverHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(PopoverHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    function getTrigger(): HTMLElement {
        return fixture.nativeElement.querySelector('.zyr-popover__trigger');
    }

    // The panel is portaled to document.body to escape ancestor clipping,
    // so it must be queried there rather than inside the fixture.
    function getPanel(): HTMLElement {
        return document.body.querySelector('.zyr-popover__panel')!;
    }

    function isPanelOpen(): boolean {
        return getPanel().classList.contains('zyr-popover__panel--open');
    }

    // ── Content ───────────────────────────────────────────────────────────
    it('renders projected trigger content', () => {
        expect(getTrigger().textContent).toContain('Open');
    });

    it('does not show the panel as open by default', () => {
        expect(isPanelOpen()).toBeFalse();
    });

    it('renders the panel with projected content when open', () => {
        getTrigger().click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeTrue();
        expect(getPanel().textContent).toContain('Popover body');
    });

    // ── Portal ────────────────────────────────────────────────────────────
    it('renders the panel as a child of document.body, not inside the fixture', () => {
        expect(fixture.nativeElement.querySelector('.zyr-popover__panel')).toBeNull();
        expect(getPanel().parentElement).toBe(document.body);
    });

    it('removes the panel from document.body when the component is destroyed', () => {
        expect(document.body.querySelector('.zyr-popover__panel')).not.toBeNull();
        fixture.destroy();
        expect(document.body.querySelector('.zyr-popover__panel')).toBeNull();
    });

    // ── Click trigger ─────────────────────────────────────────────────────
    it('toggles open on trigger click when trigger is click', () => {
        getTrigger().click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeTrue();

        getTrigger().click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeFalse();
    });

    // ── Hover trigger ─────────────────────────────────────────────────────
    it('opens on mouseenter and closes on mouseleave when trigger is hover', () => {
        host.trigger.set('hover');
        fixture.detectChanges();
        const trigger = getTrigger();

        trigger.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        expect(isPanelOpen()).toBeTrue();

        trigger.dispatchEvent(new MouseEvent('mouseleave'));
        fixture.detectChanges();
        expect(isPanelOpen()).toBeFalse();
    });

    it('does not toggle on click when trigger is hover', () => {
        host.trigger.set('hover');
        fixture.detectChanges();
        getTrigger().click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeFalse();
    });

    // ── Position ──────────────────────────────────────────────────────────
    it('applies the default bottom position class', () => {
        getTrigger().click();
        fixture.detectChanges();
        expect(getPanel().classList).toContain('zyr-popover__panel--bottom');
    });

    it('applies a custom position class', () => {
        host.position.set('left');
        fixture.detectChanges();
        getTrigger().click();
        fixture.detectChanges();
        expect(getPanel().classList).toContain('zyr-popover__panel--left');
    });

    // ── Outside click ─────────────────────────────────────────────────────
    it('closes when clicking outside and closeOnOutsideClick is true', () => {
        getTrigger().click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeTrue();

        const outside: HTMLElement = fixture.nativeElement.querySelector('#outside');
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();
        expect(isPanelOpen()).toBeFalse();
    });

    it('does not close on outside click when closeOnOutsideClick is false', () => {
        host.closeOnOutsideClick.set(false);
        fixture.detectChanges();
        getTrigger().click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeTrue();

        const outside: HTMLElement = fixture.nativeElement.querySelector('#outside');
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();
        expect(isPanelOpen()).toBeTrue();
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('sets role="dialog" on the panel', () => {
        getTrigger().click();
        fixture.detectChanges();
        expect(getPanel().getAttribute('role')).toBe('dialog');
    });
});

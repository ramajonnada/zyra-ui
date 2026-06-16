import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraTab } from './zyra-tab';
import { ZyraTabs } from './zyra-tabs';

@Component({
    standalone: true,
    imports: [ZyraTabs, ZyraTab],
    template: `
        <zyra-tabs>
            <zyra-tab label="Overview">Overview content</zyra-tab>
            <zyra-tab label="Details">Details content</zyra-tab>
            <zyra-tab label="Locked" [disabled]="true">Locked content</zyra-tab>
        </zyra-tabs>
    `,
})
class TabsHostComponent {}

describe('ZyraTabs', () => {
    let fixture: ComponentFixture<TabsHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TabsHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(TabsHostComponent);
        fixture.detectChanges();
    });

    // ── Default state ─────────────────────────────────────────────────────
    it('activates the first non-disabled tab by default', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        expect(triggers[0].classList).toContain('zyr-tabs__trigger--active');
        expect(triggers[1].classList).not.toContain('zyr-tabs__trigger--active');
    });

    it('renders the first tab panel content by default', () => {
        const panel: HTMLElement = fixture.nativeElement.querySelector('.zyr-tab__panel--active');
        expect(panel.textContent).toContain('Overview content');
    });

    // ── Click activation ──────────────────────────────────────────────────
    it('activates a tab on click', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        expect(triggers[1].classList).toContain('zyr-tabs__trigger--active');
        expect(triggers[0].classList).not.toContain('zyr-tabs__trigger--active');
    });

    it('shows correct panel content after switching tabs', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        const panel: HTMLElement = fixture.nativeElement.querySelector('.zyr-tab__panel--active');
        expect(panel.textContent).toContain('Details content');
    });

    // ── Disabled tab ──────────────────────────────────────────────────────
    it('does not activate a disabled tab on click', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        triggers[2].click();
        fixture.detectChanges();
        expect(triggers[2].classList).not.toContain('zyr-tabs__trigger--active');
        expect(triggers[0].classList).toContain('zyr-tabs__trigger--active');
    });

    it('applies --disabled class to the disabled tab trigger', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        expect(triggers[2].classList).toContain('zyr-tabs__trigger--disabled');
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('renders triggers with role="tab"', () => {
        const tabs: NodeList = fixture.nativeElement.querySelectorAll('[role="tab"]');
        expect(tabs.length).toBe(3);
    });

    it('renders panels with role="tabpanel"', () => {
        const panels: NodeList = fixture.nativeElement.querySelectorAll('[role="tabpanel"]');
        expect(panels.length).toBe(3);
    });

    it('active trigger has aria-selected="true"', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
        expect(triggers[0].getAttribute('aria-selected')).toBe('true');
        expect(triggers[1].getAttribute('aria-selected')).toBe('false');
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('navigates to the next tab on ArrowRight', () => {
        const tabsEl: HTMLElement = fixture.nativeElement.querySelector('zyra-tabs');
        tabsEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        expect(triggers[1].classList).toContain('zyr-tabs__trigger--active');
    });

    it('navigates to the previous tab on ArrowLeft', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        fixture.nativeElement.querySelector('zyra-tabs')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        fixture.detectChanges();
        const updated: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        expect(updated[0].classList).toContain('zyr-tabs__trigger--active');
    });

    it('skips disabled tabs during keyboard navigation', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        fixture.nativeElement.querySelector('zyra-tabs')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        const updated: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        expect(updated[2].classList).not.toContain('zyr-tabs__trigger--active');
    });

    it('wraps from last enabled tab back to first on ArrowRight', () => {
        const triggers: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        fixture.nativeElement.querySelector('zyra-tabs')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        const updated: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger');
        expect(updated[0].classList).toContain('zyr-tabs__trigger--active');
    });
});

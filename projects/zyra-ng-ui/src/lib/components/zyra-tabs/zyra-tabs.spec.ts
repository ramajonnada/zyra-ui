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
            <zyra-tab label="Details" badge="5">Details content</zyra-tab>
            <zyra-tab label="Locked" [disabled]="true">Locked content</zyra-tab>
        </zyra-tabs>
    `,
})
class TabsHostComponent {}

@Component({
    standalone: true,
    imports: [ZyraTabs, ZyraTab],
    template: `
        <zyra-tabs>
            <zyra-tab label="Home" icon="🏠" closeable>Home content</zyra-tab>
            <zyra-tab label="Settings" closeable>Settings content</zyra-tab>
        </zyra-tabs>
    `,
})
class CloseableTabsHostComponent {}

describe('ZyraTabs', () => {
    let fixture: ComponentFixture<TabsHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TabsHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(TabsHostComponent);
        fixture.detectChanges();
    });

    // ── Default state ─────────────────────────────────────────────────────
    it('activates the first non-disabled tab by default', () => {
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(triggers[0].classList).toContain('zyr-tabs__trigger--active');
        expect(triggers[1].classList).not.toContain('zyr-tabs__trigger--active');
    });

    it('renders the first tab panel content by default', () => {
        const panel: HTMLElement = fixture.nativeElement.querySelector('.zyr-tab__panel--active');
        expect(panel.textContent).toContain('Overview content');
    });

    // ── Click activation ──────────────────────────────────────────────────
    it('activates a tab on click', () => {
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        expect(triggers[1].classList).toContain('zyr-tabs__trigger--active');
        expect(triggers[0].classList).not.toContain('zyr-tabs__trigger--active');
    });

    it('shows correct panel content after switching tabs', () => {
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        const panel: HTMLElement = fixture.nativeElement.querySelector('.zyr-tab__panel--active');
        expect(panel.textContent).toContain('Details content');
    });

    // ── Disabled tab ──────────────────────────────────────────────────────
    it('does not activate a disabled tab on click', () => {
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        triggers[2].click();
        fixture.detectChanges();
        expect(triggers[2].classList).not.toContain('zyr-tabs__trigger--active');
        expect(triggers[0].classList).toContain('zyr-tabs__trigger--active');
    });

    it('applies --disabled class to the disabled tab trigger', () => {
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(triggers[2].classList).toContain('zyr-tabs__trigger--disabled');
    });

    // ── Badge ─────────────────────────────────────────────────────────────
    it('renders a badge when badge input is set', () => {
        const badge: HTMLElement = fixture.nativeElement.querySelector('.zyr-tabs__trigger-badge');
        expect(badge).toBeTruthy();
        expect(badge.textContent?.trim()).toBe('5');
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
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        expect(triggers[0].getAttribute('aria-selected')).toBe('true');
        expect(triggers[1].getAttribute('aria-selected')).toBe('false');
    });

    // ── Keyboard navigation ───────────────────────────────────────────────
    it('navigates to the next tab on ArrowRight', () => {
        const tabsEl: HTMLElement = fixture.nativeElement.querySelector('zyra-tabs');
        tabsEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(triggers[1].classList).toContain('zyr-tabs__trigger--active');
    });

    it('navigates to the previous tab on ArrowLeft', () => {
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        fixture.nativeElement.querySelector('zyra-tabs')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        fixture.detectChanges();
        const updated = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(updated[0].classList).toContain('zyr-tabs__trigger--active');
    });

    it('skips disabled tabs during keyboard navigation', () => {
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        fixture.nativeElement.querySelector('zyra-tabs')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        const updated = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(updated[2].classList).not.toContain('zyr-tabs__trigger--active');
    });

    it('wraps from last enabled tab back to first on ArrowRight', () => {
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        triggers[1].click();
        fixture.detectChanges();
        fixture.nativeElement.querySelector('zyra-tabs')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        const updated = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(updated[0].classList).toContain('zyr-tabs__trigger--active');
    });
});

describe('ZyraTabs — closeable', () => {
    let fixture: ComponentFixture<CloseableTabsHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [CloseableTabsHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(CloseableTabsHostComponent);
        fixture.detectChanges();
    });

    it('renders close buttons for closeable tabs', () => {
        const closes: NodeList = fixture.nativeElement.querySelectorAll('.zyr-tabs__trigger-close');
        expect(closes.length).toBe(2);
    });

    it('renders icon for tabs with icon input', () => {
        const icon: HTMLElement = fixture.nativeElement.querySelector('.zyr-tabs__trigger-icon');
        expect(icon).toBeTruthy();
        expect(icon.textContent?.trim()).toBe('🏠');
    });

    it('removes a tab from the list when its close button is clicked', () => {
        const closes = fixture.nativeElement.querySelectorAll<HTMLElement>('.zyr-tabs__trigger-close');
        closes[0].click();
        fixture.detectChanges();
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(triggers.length).toBe(1);
    });

    it('activates the next tab when the active tab is closed', () => {
        const closes = fixture.nativeElement.querySelectorAll<HTMLElement>('.zyr-tabs__trigger-close');
        closes[0].click();
        fixture.detectChanges();
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(triggers[0].classList).toContain('zyr-tabs__trigger--active');
    });

    it('closes the active closeable tab on Delete key', () => {
        const tabsEl: HTMLElement = fixture.nativeElement.querySelector('zyra-tabs');
        tabsEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
        fixture.detectChanges();
        const triggers = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.zyr-tabs__trigger');
        expect(triggers.length).toBe(1);
    });
});

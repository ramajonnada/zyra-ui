import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraSidebar } from './zyra-sidebar';
import { ZyraSidebarItem } from './zyra-sidebar-item';
import { ZyraSidebarSection } from './zyra-sidebar-section';

@Component({
    standalone: true,
    imports: [ZyraSidebar, ZyraSidebarSection, ZyraSidebarItem],
    template: `
        <zyra-sidebar [(collapsed)]="collapsed">
            <zyra-sidebar-section heading="Getting started">
                <a zyra-sidebar-item href="/docs" [active]="true">Overview</a>
                <a zyra-sidebar-item href="/docs/installation">Installation</a>
                <a zyra-sidebar-item href="#" [disabled]="true" (itemClick)="onClick()">Disabled</a>
            </zyra-sidebar-section>
        </zyra-sidebar>
    `,
})
class SidebarHostComponent {
    collapsed = false;
    clicked = 0;

    onClick(): void {
        this.clicked++;
    }
}

describe('ZyraSidebar', () => {
    let fixture: ComponentFixture<SidebarHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [SidebarHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(SidebarHostComponent);
        fixture.detectChanges();
    });

    // ── Structure ─────────────────────────────────────────────────────────
    it('renders an aside with a nav region containing the items', () => {
        const aside: HTMLElement = fixture.nativeElement.querySelector('.zyr-sidebar');
        expect(aside).toBeTruthy();
        const items = fixture.nativeElement.querySelectorAll('.zyr-sidebar-item');
        expect(items.length).toBe(3);
    });

    it('renders the section heading', () => {
        const heading: HTMLElement = fixture.nativeElement.querySelector(
            '.zyr-sidebar-section__heading',
        );
        expect(heading.textContent).toContain('Getting started');
    });

    // ── Active / disabled state ──────────────────────────────────────────
    it('marks the active item with aria-current="page"', () => {
        const links: NodeListOf<HTMLAnchorElement> =
            fixture.nativeElement.querySelectorAll('.zyr-sidebar-item');
        expect(links[0].getAttribute('aria-current')).toBe('page');
        expect(links[1].getAttribute('aria-current')).toBeNull();
    });

    it('does not emit itemClick and marks disabled items non-interactive', () => {
        const links: NodeListOf<HTMLAnchorElement> =
            fixture.nativeElement.querySelectorAll('.zyr-sidebar-item');
        const disabled = links[2];
        expect(disabled.getAttribute('aria-disabled')).toBe('true');
        expect(disabled.getAttribute('tabindex')).toBe('-1');
        disabled.click();
        expect(fixture.componentInstance.clicked).toBe(0);
    });

    // ── Collapse toggle ───────────────────────────────────────────────────
    it('toggles the collapsed class via two-way binding', () => {
        const sidebar = fixture.debugElement.children[0].componentInstance as ZyraSidebar;
        sidebar.toggle();
        fixture.detectChanges();
        expect(fixture.componentInstance.collapsed).toBe(true);
        const aside: HTMLElement = fixture.nativeElement.querySelector('.zyr-sidebar');
        expect(aside.classList).toContain('zyr-sidebar--collapsed');
    });
});

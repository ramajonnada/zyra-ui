import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraDropdownMenu } from './zyra-dropdown-menu';
import { ZyraMenuItem } from './zyra-menu-item';

@Component({
    standalone: true,
    imports: [ZyraDropdownMenu, ZyraMenuItem],
    template: `
        <zyra-dropdown-menu [align]="align()">
            <button slot="trigger">Actions</button>
            <zyra-menu-item (itemClick)="editClicked.set(true)">Edit</zyra-menu-item>
            <zyra-menu-item variant="danger" [disabled]="deleteDisabled()" (itemClick)="deleteClicked.set(true)"
                >Delete</zyra-menu-item
            >
        </zyra-dropdown-menu>
    `,
})
class DropdownHostComponent {
    align = signal<'start' | 'end'>('start');
    deleteDisabled = signal(false);
    editClicked = signal(false);
    deleteClicked = signal(false);
}

describe('ZyraDropdownMenu', () => {
    let fixture: ComponentFixture<DropdownHostComponent>;
    let host: DropdownHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [DropdownHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(DropdownHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    function getTrigger(): HTMLElement {
        return fixture.nativeElement.querySelector('.zyr-dropdown__trigger');
    }

    // The panel is portaled to document.body to escape ancestor clipping,
    // so it must be queried there rather than inside the fixture.
    function getPanel(): HTMLElement {
        return document.body.querySelector('.zyr-dropdown__panel')!;
    }

    function isPanelOpen(): boolean {
        return getPanel().classList.contains('zyr-dropdown__panel--open');
    }

    // ── Open / close ──────────────────────────────────────────────────────
    it('does not show the panel as open by default', () => {
        expect(isPanelOpen()).toBeFalse();
    });

    it('opens the panel when the trigger is clicked', () => {
        getTrigger().click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeTrue();
    });

    it('toggles the panel closed on a second trigger click', () => {
        getTrigger().click();
        fixture.detectChanges();
        getTrigger().click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeFalse();
    });

    it('closes when clicking outside the component', () => {
        getTrigger().click();
        fixture.detectChanges();
        document.body.click();
        fixture.detectChanges();
        expect(isPanelOpen()).toBeFalse();
    });

    it('closes on Escape key', () => {
        getTrigger().click();
        fixture.detectChanges();
        fixture.nativeElement.querySelector('zyra-dropdown-menu').dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
        );
        fixture.detectChanges();
        expect(isPanelOpen()).toBeFalse();
    });

    // ── Portal ────────────────────────────────────────────────────────────
    it('renders the panel as a child of document.body, not inside the fixture', () => {
        expect(fixture.nativeElement.querySelector('.zyr-dropdown__panel')).toBeNull();
        expect(getPanel().parentElement).toBe(document.body);
    });

    it('removes the panel from document.body when the component is destroyed', () => {
        expect(document.body.querySelector('.zyr-dropdown__panel')).not.toBeNull();
        fixture.destroy();
        expect(document.body.querySelector('.zyr-dropdown__panel')).toBeNull();
    });

    // ── Alignment ─────────────────────────────────────────────────────────
    it('positions the panel from the left for start alignment', () => {
        getTrigger().click();
        fixture.detectChanges();
        expect(getPanel().style.left).not.toBe('');
        expect(getPanel().style.right).toBe('auto');
    });

    it('positions the panel from the right for end alignment', () => {
        host.align.set('end');
        fixture.detectChanges();
        getTrigger().click();
        fixture.detectChanges();
        expect(getPanel().style.right).not.toBe('auto');
        expect(getPanel().style.left).toBe('auto');
    });

    // ── Menu items ────────────────────────────────────────────────────────
    it('emits itemClick and closes the menu when an enabled item is clicked', () => {
        getTrigger().click();
        fixture.detectChanges();
        const editBtn: HTMLButtonElement = getPanel().querySelector('.zyr-menu-item')!;
        editBtn.click();
        fixture.detectChanges();
        expect(host.editClicked()).toBeTrue();
        expect(isPanelOpen()).toBeFalse();
    });

    it('does not emit itemClick or close the menu when a disabled item is clicked', () => {
        host.deleteDisabled.set(true);
        fixture.detectChanges();
        getTrigger().click();
        fixture.detectChanges();
        const deleteBtn: HTMLButtonElement = getPanel().querySelectorAll('.zyr-menu-item')[1] as HTMLButtonElement;
        expect(deleteBtn.disabled).toBeTrue();
        deleteBtn.click();
        fixture.detectChanges();
        expect(host.deleteClicked()).toBeFalse();
        expect(isPanelOpen()).toBeTrue();
    });

    it('applies the danger variant class to the delete item', () => {
        getTrigger().click();
        fixture.detectChanges();
        const deleteBtn: HTMLButtonElement = getPanel().querySelectorAll('.zyr-menu-item')[1] as HTMLButtonElement;
        expect(deleteBtn.classList).toContain('zyr-menu-item--danger');
    });
});

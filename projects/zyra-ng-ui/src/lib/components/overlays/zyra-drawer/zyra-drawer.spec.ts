import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraDrawer } from './zyra-drawer';

@Component({
    standalone: true,
    imports: [ZyraDrawer],
    template: `
        <zyra-drawer
            [(open)]="open"
            [title]="title()"
            [side]="side()"
            [size]="size()"
            [dismissible]="dismissible()"
            (closed)="onClosed()"
        >
            <p>Drawer body</p>
            <button slot="footer" type="button">Save</button>
        </zyra-drawer>
    `,
})
class DrawerHostComponent {
    open = signal(false);
    title = signal('Filters');
    side = signal<'left' | 'right' | 'top' | 'bottom'>('right');
    size = signal<'sm' | 'md' | 'lg'>('md');
    dismissible = signal(true);
    closed = false;

    onClosed(): void {
        this.closed = true;
    }
}

describe('ZyraDrawer', () => {
    let fixture: ComponentFixture<DrawerHostComponent>;
    let host: DrawerHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DrawerHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DrawerHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('does not render when open is false', () => {
        expect(fixture.nativeElement.querySelector('.zyr-drawer')).toBeNull();
    });

    it('renders when open is true', () => {
        host.open.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-drawer')).not.toBeNull();
    });

    it('renders the title', () => {
        host.open.set(true);
        fixture.detectChanges();

        const title: HTMLElement = fixture.nativeElement.querySelector('.zyr-drawer__title');
        expect(title.textContent?.trim()).toBe('Filters');
    });

    it('applies the side and size classes to the panel', () => {
        host.open.set(true);
        host.side.set('left');
        host.size.set('lg');
        fixture.detectChanges();

        const panel: HTMLElement = fixture.nativeElement.querySelector('.zyr-drawer__panel');
        expect(panel.classList).toContain('zyr-drawer__panel--left');
        expect(panel.classList).toContain('zyr-drawer__panel--lg');
    });

    it('defaults to the right side', () => {
        host.open.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-drawer__panel--right')).not.toBeNull();
    });

    it('shows close button when dismissible is true', () => {
        host.open.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-drawer__close')).not.toBeNull();
    });

    it('hides close button when dismissible is false', () => {
        host.open.set(true);
        host.dismissible.set(false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-drawer__close')).toBeNull();
    });

    it('closes and emits closed when close button is clicked', () => {
        host.open.set(true);
        fixture.detectChanges();

        const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-drawer__close');
        closeBtn.click();
        fixture.detectChanges();

        expect(host.open()).toBeFalse();
        expect(host.closed).toBeTrue();
    });

    it('closes on backdrop click', () => {
        host.open.set(true);
        fixture.detectChanges();

        const backdrop: HTMLElement = fixture.nativeElement.querySelector('.zyr-drawer');
        backdrop.click();
        fixture.detectChanges();

        expect(host.open()).toBeFalse();
    });

    it('does not close on backdrop click when dismissible is false', () => {
        host.open.set(true);
        host.dismissible.set(false);
        fixture.detectChanges();

        const backdrop: HTMLElement = fixture.nativeElement.querySelector('.zyr-drawer');
        backdrop.click();
        fixture.detectChanges();

        expect(host.open()).toBeTrue();
    });

    it('closes on Escape key press', () => {
        host.open.set(true);
        fixture.detectChanges();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();

        expect(host.open()).toBeFalse();
    });

    it('renders body and footer content', () => {
        host.open.set(true);
        fixture.detectChanges();

        const body: HTMLElement = fixture.nativeElement.querySelector('.zyr-drawer__body');
        expect(body.textContent).toContain('Drawer body');
        expect(fixture.nativeElement.querySelector('.zyr-drawer__footer button')).not.toBeNull();
    });

    it('has role="dialog" and aria-modal on the panel', () => {
        host.open.set(true);
        fixture.detectChanges();

        const panel: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
        expect(panel).not.toBeNull();
        expect(panel.getAttribute('aria-modal')).toBe('true');
    });
});

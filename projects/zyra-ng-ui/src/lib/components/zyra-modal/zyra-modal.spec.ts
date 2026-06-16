import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraModal } from './zyra-modal';

@Component({
    standalone: true,
    imports: [ZyraModal],
    template: `
        <zyra-modal
            [(open)]="open"
            [title]="title()"
            [size]="size()"
            [dismissible]="dismissible()"
            (closed)="onClosed()"
        >
            <p>Modal body</p>
            <button slot="footer" type="button">Confirm</button>
        </zyra-modal>
    `,
})
class ModalHostComponent {
    open = signal(false);
    title = signal('Confirm action');
    size = signal<'sm' | 'md' | 'lg' | 'xl'>('md');
    dismissible = signal(true);
    closed = false;

    onClosed(): void {
        this.closed = true;
    }
}

describe('ZyraModal', () => {
    let fixture: ComponentFixture<ModalHostComponent>;
    let host: ModalHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('does not render when open is false', () => {
        expect(fixture.nativeElement.querySelector('.zyr-modal')).toBeNull();
    });

    it('renders when open is true', () => {
        host.open.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-modal')).not.toBeNull();
    });

    it('renders the title', () => {
        host.open.set(true);
        fixture.detectChanges();

        const title: HTMLElement = fixture.nativeElement.querySelector('.zyr-modal__title');
        expect(title.textContent?.trim()).toBe('Confirm action');
    });

    it('applies the size class to the panel', () => {
        host.open.set(true);
        host.size.set('lg');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-modal__panel--lg')).not.toBeNull();
    });

    it('shows close button when dismissible is true', () => {
        host.open.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-modal__close')).not.toBeNull();
    });

    it('hides close button when dismissible is false', () => {
        host.open.set(true);
        host.dismissible.set(false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-modal__close')).toBeNull();
    });

    it('closes and emits closed when close button is clicked', () => {
        host.open.set(true);
        fixture.detectChanges();

        const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-modal__close');
        closeBtn.click();
        fixture.detectChanges();

        expect(host.open()).toBeFalse();
        expect(host.closed).toBeTrue();
    });

    it('closes on backdrop click', () => {
        host.open.set(true);
        fixture.detectChanges();

        const backdrop: HTMLElement = fixture.nativeElement.querySelector('.zyr-modal');
        backdrop.click();
        fixture.detectChanges();

        expect(host.open()).toBeFalse();
    });

    it('does not close on backdrop click when dismissible is false', () => {
        host.open.set(true);
        host.dismissible.set(false);
        fixture.detectChanges();

        const backdrop: HTMLElement = fixture.nativeElement.querySelector('.zyr-modal');
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

    it('renders body content', () => {
        host.open.set(true);
        fixture.detectChanges();

        const body: HTMLElement = fixture.nativeElement.querySelector('.zyr-modal__body');
        expect(body.textContent).toContain('Modal body');
    });

    it('has role="dialog" and aria-modal on the panel', () => {
        host.open.set(true);
        fixture.detectChanges();

        const panel: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
        expect(panel).not.toBeNull();
        expect(panel.getAttribute('aria-modal')).toBe('true');
    });
});

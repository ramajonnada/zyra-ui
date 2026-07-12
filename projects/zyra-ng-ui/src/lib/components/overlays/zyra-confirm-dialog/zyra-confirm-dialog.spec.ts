import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraConfirmDialog } from './zyra-confirm-dialog';

@Component({
    standalone: true,
    imports: [ZyraConfirmDialog],
    template: `
        <zyra-confirm-dialog
            [(open)]="open"
            [title]="title()"
            [message]="message()"
            [tone]="tone()"
            [loading]="loading()"
            (confirmed)="onConfirmed()"
            (cancelled)="onCancelled()"
        />
    `,
})
class ConfirmDialogHostComponent {
    open = signal(false);
    title = signal('Delete item');
    message = signal('This cannot be undone.');
    tone = signal<'default' | 'danger'>('default');
    loading = signal(false);
    confirmed = false;
    cancelled = false;

    onConfirmed(): void {
        this.confirmed = true;
    }

    onCancelled(): void {
        this.cancelled = true;
    }
}

describe('ZyraConfirmDialog', () => {
    let fixture: ComponentFixture<ConfirmDialogHostComponent>;
    let host: ConfirmDialogHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmDialogHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialogHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('does not render the modal when closed', () => {
        expect(fixture.nativeElement.querySelector('.zyr-modal')).toBeNull();
    });

    it('renders the modal, title, and message when open', () => {
        host.open.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-modal')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-modal__title')?.textContent?.trim()).toBe(
            'Delete item',
        );
        expect(
            fixture.nativeElement.querySelector('.zyr-confirm-dialog__message')?.textContent?.trim(),
        ).toBe('This cannot be undone.');
    });

    it('emits confirmed and does not auto-close when Confirm is clicked', () => {
        host.open.set(true);
        fixture.detectChanges();

        const buttons: NodeListOf<HTMLButtonElement> =
            fixture.nativeElement.querySelectorAll('zyra-button button');
        buttons[buttons.length - 1].click();
        fixture.detectChanges();

        expect(host.confirmed).toBeTrue();
        expect(host.open()).toBeTrue();
    });

    it('emits cancelled and closes when Cancel is clicked', () => {
        host.open.set(true);
        fixture.detectChanges();

        const buttons: NodeListOf<HTMLButtonElement> =
            fixture.nativeElement.querySelectorAll('zyra-button button');
        buttons[0].click();
        fixture.detectChanges();

        expect(host.cancelled).toBeTrue();
        expect(host.open()).toBeFalse();
    });

    it('emits cancelled when dismissed via Escape', () => {
        host.open.set(true);
        fixture.detectChanges();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();

        expect(host.cancelled).toBeTrue();
        expect(host.open()).toBeFalse();
    });

    it('does not emit confirmed when loading is true and Confirm is clicked', () => {
        host.open.set(true);
        host.loading.set(true);
        fixture.detectChanges();

        const buttons: NodeListOf<HTMLButtonElement> =
            fixture.nativeElement.querySelectorAll('zyra-button button');
        buttons[buttons.length - 1].click();
        fixture.detectChanges();

        expect(host.confirmed).toBeFalse();
    });

    it('applies the danger button variant when tone is "danger"', () => {
        host.tone.set('danger');
        host.open.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-btn--danger')).not.toBeNull();
    });

    it('has role="dialog" and aria-modal via the underlying modal', () => {
        host.open.set(true);
        fixture.detectChanges();

        const panel: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
        expect(panel).not.toBeNull();
        expect(panel.getAttribute('aria-modal')).toBe('true');
    });
});

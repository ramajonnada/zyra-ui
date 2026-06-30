import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraAlert } from './zyra-alert';

@Component({
    standalone: true,
    imports: [ZyraAlert],
    template: `
        <zyra-alert
            [variant]="variant()"
            [title]="title()"
            [dismissible]="dismissible()"
            (dismissed)="onDismissed()"
            >Alert body text</zyra-alert
        >
    `,
})
class AlertHostComponent {
    variant = signal<'success' | 'warning' | 'danger' | 'info'>('info');
    title = signal('');
    dismissible = signal(false);
    dismissed = false;

    onDismissed(): void {
        this.dismissed = true;
    }
}

describe('ZyraAlert', () => {
    let fixture: ComponentFixture<AlertHostComponent>;
    let host: AlertHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AlertHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('has role="alert"', () => {
        expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    });

    it('renders projected content', () => {
        const content: HTMLElement = fixture.nativeElement.querySelector('.zyr-alert__content');
        expect(content.textContent?.trim()).toBe('Alert body text');
    });

    it('applies the variant class', () => {
        host.variant.set('success');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-alert--success')).not.toBeNull();
    });

    it('renders title when provided', () => {
        host.title.set('Heads up');
        fixture.detectChanges();

        const title: HTMLElement = fixture.nativeElement.querySelector('.zyr-alert__title');
        expect(title).not.toBeNull();
        expect(title.textContent?.trim()).toBe('Heads up');
    });

    it('does not render title element when title is empty', () => {
        expect(fixture.nativeElement.querySelector('.zyr-alert__title')).toBeNull();
    });

    it('shows dismiss button when dismissible is true', () => {
        host.dismissible.set(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-alert__dismiss')).not.toBeNull();
    });

    it('hides dismiss button when dismissible is false', () => {
        expect(fixture.nativeElement.querySelector('.zyr-alert__dismiss')).toBeNull();
    });

    it('adds --dismissing class when dismiss is called', () => {
        host.dismissible.set(true);
        fixture.detectChanges();

        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-alert__dismiss');
        btn.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-alert--dismissing')).not.toBeNull();
    });

    it('emits dismissed on animationend after dismissing', () => {
        const instance: ZyraAlert = fixture.debugElement.children[0].componentInstance;
        instance.dismissing.set(true);
        fixture.detectChanges();

        const alertEl: HTMLElement = fixture.nativeElement.querySelector('.zyr-alert');
        alertEl.dispatchEvent(new Event('animationend'));
        fixture.detectChanges();

        expect(host.dismissed).toBeTrue();
    });

    it('renders an icon for the variant', () => {
        const icon: HTMLElement = fixture.nativeElement.querySelector('.zyr-alert__icon');
        expect(icon).not.toBeNull();
        expect(icon.innerHTML).toContain('<svg');
    });
});

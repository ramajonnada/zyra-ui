import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraToastContainer, ZyraToastService } from './zyra-toast';

// ─── ZyraToastService ────────────────────────────────────────────
describe('ZyraToastService', () => {
    let service: ZyraToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ZyraToastService);
        service.dismissAll();
    });

    it('adds a success toast with the correct variant', () => {
        service.success('Saved');
        expect(service.toasts()[0].variant).toBe('success');
        expect(service.toasts()[0].title).toBe('Saved');
    });

    it('adds an error toast with the correct variant', () => {
        service.error('Failed');
        expect(service.toasts()[0].variant).toBe('error');
    });

    it('adds a warning toast with the correct variant', () => {
        service.warning('Watch out');
        expect(service.toasts()[0].variant).toBe('warning');
    });

    it('adds an info toast with the correct variant', () => {
        service.info('Heads up');
        expect(service.toasts()[0].variant).toBe('info');
    });

    it('defaults duration to 4000ms', () => {
        service.success('Hello');
        expect(service.toasts()[0].duration).toBe(4000);
    });

    it('defaults description to empty string', () => {
        service.success('Hello');
        expect(service.toasts()[0].description).toBe('');
    });

    it('stores a custom description', () => {
        service.success('Hello', { description: 'More detail here' });
        expect(service.toasts()[0].description).toBe('More detail here');
    });

    it('stores a custom duration', () => {
        service.info('Notice', { duration: 1500 });
        expect(service.toasts()[0].duration).toBe(1500);
    });

    it('duration: 0 keeps the toast persistent (no auto-dismiss)', () => {
        jasmine.clock().install();
        service.success('Persistent', { duration: 0 });
        jasmine.clock().tick(10000);
        expect(service.toasts().length).toBe(1);
        jasmine.clock().uninstall();
    });

    it('auto-dismisses after the specified duration', () => {
        jasmine.clock().install();
        service.success('Bye', { duration: 500 });
        expect(service.toasts().length).toBe(1);
        jasmine.clock().tick(500);
        expect(service.toasts().length).toBe(0);
        jasmine.clock().uninstall();
    });

    it('stacks multiple toasts', () => {
        service.success('One');
        service.error('Two');
        service.info('Three');
        expect(service.toasts().length).toBe(3);
    });

    it('dismisses a specific toast by id', () => {
        service.success('Keep', { duration: 0 });
        service.error('Remove', { duration: 0 });
        const idToRemove = service.toasts()[1].id;

        service.dismiss(idToRemove);

        expect(service.toasts().length).toBe(1);
        expect(service.toasts()[0].title).toBe('Keep');
    });

    it('dismissAll clears every toast', () => {
        service.success('A', { duration: 0 });
        service.error('B', { duration: 0 });
        service.warning('C', { duration: 0 });

        service.dismissAll();

        expect(service.toasts().length).toBe(0);
    });

    it('assigns a unique id to each toast', () => {
        service.success('First', { duration: 0 });
        service.success('Second', { duration: 0 });
        const [a, b] = service.toasts();
        expect(a.id).not.toBe(b.id);
    });
});

// ─── ZyraToastContainer ──────────────────────────────────────────
describe('ZyraToastContainer', () => {
    let fixture: ComponentFixture<ZyraToastContainer>;
    let service: ZyraToastService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZyraToastContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(ZyraToastContainer);
        service = TestBed.inject(ZyraToastService);
        service.dismissAll();
        fixture.detectChanges();
    });

    afterEach(() => {
        service.dismissAll();
    });

    it('renders user-facing toast content from the service', () => {
        service.success('Saved', { description: 'Changes were stored', duration: 0 });
        fixture.detectChanges();

        const toast: HTMLElement = fixture.nativeElement.querySelector('.zyr-toast');
        expect(toast).not.toBeNull();
        expect(toast.textContent).toContain('Saved');
        expect(toast.textContent).toContain('Changes were stored');
    });

    it('dismisses a toast from the close action', () => {
        service.info('Heads up', { description: 'Notice text', duration: 0 });
        fixture.detectChanges();

        const closeButton: HTMLButtonElement =
            fixture.nativeElement.querySelector('.zyr-toast__close');
        closeButton.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-toast')).toBeNull();
    });

    it('has role="region" and aria-label on the container', () => {
        const container: HTMLElement =
            fixture.nativeElement.querySelector('.zyr-toast-container');
        expect(container.getAttribute('role')).toBe('region');
        expect(container.getAttribute('aria-label')).toBe('Notifications');
    });

    it('has aria-live="polite" on the container', () => {
        const container: HTMLElement =
            fixture.nativeElement.querySelector('.zyr-toast-container');
        expect(container.getAttribute('aria-live')).toBe('polite');
    });

    it('each toast item has role="alert"', () => {
        service.error('Something broke', { duration: 0 });
        fixture.detectChanges();

        const toast: HTMLElement = fixture.nativeElement.querySelector('.zyr-toast');
        expect(toast.getAttribute('role')).toBe('alert');
    });

    it('close button has aria-label="Dismiss"', () => {
        service.success('Done', { duration: 0 });
        fixture.detectChanges();

        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.zyr-toast__close');
        expect(btn.getAttribute('aria-label')).toBe('Dismiss');
    });

    it('applies the variant CSS class to each toast', () => {
        service.warning('Watch out', { duration: 0 });
        fixture.detectChanges();

        const toast: HTMLElement = fixture.nativeElement.querySelector('.zyr-toast');
        expect(toast.classList).toContain('zyr-toast--warning');
    });

    it('renders multiple toasts simultaneously', () => {
        service.success('One', { duration: 0 });
        service.error('Two', { duration: 0 });
        service.info('Three', { duration: 0 });
        fixture.detectChanges();

        const toasts = fixture.nativeElement.querySelectorAll('.zyr-toast');
        expect(toasts.length).toBe(3);
    });

    it('renders no toasts when the list is empty', () => {
        fixture.detectChanges();
        const toasts = fixture.nativeElement.querySelectorAll('.zyr-toast');
        expect(toasts.length).toBe(0);
    });

    it('omits the description element when description is empty', () => {
        service.success('Title only', { duration: 0 });
        fixture.detectChanges();

        const desc = fixture.nativeElement.querySelector('.zyr-toast__desc');
        expect(desc).toBeNull();
    });

    it('shows the description element when description is provided', () => {
        service.success('Title', { description: 'Some detail', duration: 0 });
        fixture.detectChanges();

        const desc: HTMLElement = fixture.nativeElement.querySelector('.zyr-toast__desc');
        expect(desc).not.toBeNull();
        expect(desc.textContent?.trim()).toBe('Some detail');
    });

    it('removes the toast from the DOM after auto-dismiss', () => {
        jasmine.clock().install();
        service.success('Gone soon', { duration: 300 });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-toast')).not.toBeNull();

        jasmine.clock().tick(300);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-toast')).toBeNull();
        jasmine.clock().uninstall();
    });
});

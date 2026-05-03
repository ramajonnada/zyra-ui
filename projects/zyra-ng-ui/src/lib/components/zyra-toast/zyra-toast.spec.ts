import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraToastContainer, ZyraToastService } from './zyra-toast';

describe('ZyraToastContainer', () => {
    let fixture: ComponentFixture<ZyraToastContainer>;
    let service: ZyraToastService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZyraToastContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(ZyraToastContainer);
        service = TestBed.inject(ZyraToastService);
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

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.zyr-toast__close',
        );
        closeButton.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-toast')).toBeNull();
    });
});

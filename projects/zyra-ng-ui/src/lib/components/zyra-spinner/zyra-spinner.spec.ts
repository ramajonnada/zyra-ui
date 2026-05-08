import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraSpinner } from './zyra-spinner';

describe('ZyraSpinner', () => {
    let fixture: ComponentFixture<ZyraSpinner>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZyraSpinner],
        }).compileComponents();

        fixture = TestBed.createComponent(ZyraSpinner);
        fixture.componentRef.setInput('size', 'lg');
        fixture.componentRef.setInput('color', 'accent-2');
        fixture.componentRef.setInput('label', 'Loading content');
        fixture.detectChanges();
    });

    it('renders accessible loading semantics and the selected size/color', () => {
        const spinner: HTMLElement = fixture.nativeElement.querySelector('.zyr-spinner');

        expect(spinner.className).toContain('zyr-spinner--lg');
        expect(spinner.className).toContain('zyr-spinner--accent-2');
        expect(spinner.getAttribute('role')).toBe('status');
        expect(spinner.getAttribute('aria-label')).toBe('Loading content');
        expect((spinner as HTMLElement).style.width).toBe('36px');
    });
});

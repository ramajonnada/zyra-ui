import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraBadge } from './zyra-badge';

@Component({
    standalone: true,
    imports: [ZyraBadge],
    template: `
        <zyra-badge variant="info" size="lg" [dot]="true" ariaLabel="Status badge">
            Stable
        </zyra-badge>
    `,
})
class BadgeHostComponent {}

describe('ZyraBadge', () => {
    let fixture: ComponentFixture<BadgeHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BadgeHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BadgeHostComponent);
        fixture.detectChanges();
    });

    it('renders the selected size, variant, dot, and accessible label', () => {
        const badge: HTMLElement = fixture.nativeElement.querySelector('.zyr-badge');

        expect(badge.className).toContain('zyr-badge--info');
        expect(badge.className).toContain('zyr-badge--lg');
        expect(badge.getAttribute('aria-label')).toBe('Status badge');
        expect(badge.textContent).toContain('Stable');
        expect(badge.querySelector('.zyr-badge__dot')).not.toBeNull();
    });
});

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraEmptyState } from './zyra-empty-state';

@Component({
    standalone: true,
    imports: [ZyraEmptyState],
    template: `
        <zyra-empty-state [title]="title()" [description]="description()" [size]="size()">
            @if (withIcon()) {
                <span slot="icon">icon</span>
            }
            @if (withActions()) {
                <button slot="actions">Retry</button>
            }
        </zyra-empty-state>
    `,
})
class EmptyStateHostComponent {
    title = signal('No results');
    description = signal('Try adjusting your filters.');
    size = signal<'sm' | 'md' | 'lg'>('md');
    withIcon = signal(false);
    withActions = signal(false);
}

describe('ZyraEmptyState', () => {
    let fixture: ComponentFixture<EmptyStateHostComponent>;
    let host: EmptyStateHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [EmptyStateHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(EmptyStateHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Content ───────────────────────────────────────────────────────────
    it('renders the title and description', () => {
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.zyr-empty-state__title')?.textContent).toContain('No results');
        expect(el.querySelector('.zyr-empty-state__description')?.textContent).toContain(
            'Try adjusting your filters.',
        );
    });

    it('does not render title element when title is empty', () => {
        host.title.set('');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-empty-state__title')).toBeNull();
    });

    it('does not render description element when description is empty', () => {
        host.description.set('');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-empty-state__description')).toBeNull();
    });

    // ── Size ──────────────────────────────────────────────────────────────
    it('applies md size class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-empty-state--md')).not.toBeNull();
    });

    it('applies sm size class', () => {
        host.size.set('sm');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-empty-state--sm')).not.toBeNull();
    });

    it('applies lg size class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-empty-state--lg')).not.toBeNull();
    });

    // ── Slot projection ───────────────────────────────────────────────────
    it('renders projected icon content in the icon slot', () => {
        host.withIcon.set(true);
        fixture.detectChanges();
        const icon: HTMLElement = fixture.nativeElement.querySelector('.zyr-empty-state__icon');
        expect(icon.textContent).toContain('icon');
    });

    it('renders projected actions content in the actions slot', () => {
        host.withActions.set(true);
        fixture.detectChanges();
        const actions: HTMLElement = fixture.nativeElement.querySelector('.zyr-empty-state__actions');
        expect(actions.querySelector('button')?.textContent).toContain('Retry');
    });
});

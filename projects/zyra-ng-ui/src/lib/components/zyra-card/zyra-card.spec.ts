import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraCard } from './zyra-card';

@Component({
    standalone: true,
    imports: [ZyraCard],
    template: `
        <zyra-card
            [variant]="variant()"
            [padding]="padding()"
            [clickable]="clickable()"
            [hasHeader]="hasHeader()"
            [hasFooter]="hasFooter()"
            (cardClick)="clicks = clicks + 1"
        >
            <div slot="header">Header</div>
            <p>Body</p>
            <div slot="footer">Footer</div>
        </zyra-card>
    `,
})
class CardHostComponent {
    variant   = signal<'default' | 'outlined' | 'elevated' | 'ghost'>('default');
    padding   = signal<'none' | 'sm' | 'md' | 'lg'>('md');
    clickable = signal(false);
    hasHeader = signal(false);
    hasFooter = signal(false);
    clicks    = 0;
}

describe('ZyraCard', () => {
    let fixture: ComponentFixture<CardHostComponent>;
    let host: CardHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [CardHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(CardHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Variants ──────────────────────────────────────────────────────────
    it('applies default variant class', () => {
        expect(fixture.nativeElement.querySelector('.zyr-card--default')).not.toBeNull();
    });

    it('applies outlined variant class', () => {
        host.variant.set('outlined');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-card--outlined')).not.toBeNull();
    });

    it('applies elevated variant class', () => {
        host.variant.set('elevated');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-card--elevated')).not.toBeNull();
    });

    // ── Padding ───────────────────────────────────────────────────────────
    it('applies md padding class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-card__body--md')).not.toBeNull();
    });

    it('applies lg padding class', () => {
        host.padding.set('lg');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-card__body--lg')).not.toBeNull();
    });

    it('applies none padding class', () => {
        host.padding.set('none');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-card__body--none')).not.toBeNull();
    });

    // ── Body content ──────────────────────────────────────────────────────
    it('renders body content', () => {
        expect(fixture.nativeElement.textContent).toContain('Body');
    });

    // ── Header / Footer slots ─────────────────────────────────────────────
    it('does not render header by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-card__header')).toBeNull();
    });

    it('renders header when hasHeader is true', () => {
        host.hasHeader.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-card__header')).not.toBeNull();
        expect(fixture.nativeElement.textContent).toContain('Header');
    });

    it('does not render footer by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-card__footer')).toBeNull();
    });

    it('renders footer when hasFooter is true', () => {
        host.hasFooter.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-card__footer')).not.toBeNull();
        expect(fixture.nativeElement.textContent).toContain('Footer');
    });

    // ── Non-clickable ─────────────────────────────────────────────────────
    it('has no role or tabindex when not clickable', () => {
        const card: HTMLElement = fixture.nativeElement.querySelector('.zyr-card');
        expect(card.getAttribute('role')).toBeNull();
        expect(card.getAttribute('tabindex')).toBeNull();
    });

    it('does not emit cardClick when not clickable', () => {
        fixture.nativeElement.querySelector('.zyr-card').click();
        expect(host.clicks).toBe(0);
    });

    // ── Clickable ─────────────────────────────────────────────────────────
    it('applies --clickable class and sets role/tabindex when clickable', () => {
        host.clickable.set(true);
        fixture.detectChanges();
        const card: HTMLElement = fixture.nativeElement.querySelector('.zyr-card');
        expect(card.className).toContain('zyr-card--clickable');
        expect(card.getAttribute('role')).toBe('button');
        expect(card.getAttribute('tabindex')).toBe('0');
    });

    it('emits cardClick on mouse click', () => {
        host.clickable.set(true);
        fixture.detectChanges();
        fixture.nativeElement.querySelector('.zyr-card').click();
        expect(host.clicks).toBe(1);
    });

    it('emits cardClick on Enter key', () => {
        host.clickable.set(true);
        fixture.detectChanges();
        fixture.nativeElement.querySelector('.zyr-card')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(host.clicks).toBe(1);
    });

    it('emits cardClick on Space key', () => {
        host.clickable.set(true);
        fixture.detectChanges();
        fixture.nativeElement.querySelector('.zyr-card')
            .dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        expect(host.clicks).toBe(1);
    });
});

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraCard } from './zyra-card';

@Component({
    standalone: true,
    imports: [ZyraCard],
    template: `
        <zyra-card
            variant="outlined"
            padding="lg"
            [clickable]="true"
            [hasHeader]="true"
            [hasFooter]="true"
            (cardClick)="clicks = clicks + 1"
        >
            <div slot="header">Card header</div>
            <p>Body content</p>
            <div slot="footer">Card footer</div>
        </zyra-card>
    `,
})
class CardHostComponent {
    clicks = 0;
}

describe('ZyraCard', () => {
    let fixture: ComponentFixture<CardHostComponent>;
    let host: CardHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CardHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('renders header, body, footer, and interactive affordances', () => {
        const card: HTMLElement = fixture.nativeElement.querySelector('.zyr-card');

        expect(card.className).toContain('zyr-card--outlined');
        expect(card.getAttribute('role')).toBe('button');
        expect(card.getAttribute('tabindex')).toBe('0');
        expect(fixture.nativeElement.textContent).toContain('Card header');
        expect(fixture.nativeElement.textContent).toContain('Body content');
        expect(fixture.nativeElement.textContent).toContain('Card footer');
    });

    it('emits when clicked or activated from the keyboard', () => {
        const card: HTMLElement = fixture.nativeElement.querySelector('.zyr-card');

        card.click();
        card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(host.clicks).toBe(2);
    });
});

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraAvatar } from './zyra-avatar';

@Component({
    standalone: true,
    imports: [ZyraAvatar],
    template: `
        <zyra-avatar
            [name]="name()"
            [src]="src()"
            [size]="size()"
            [variant]="variant()"
            [online]="online()"
            [square]="square()"
        />
    `,
})
class AvatarHostComponent {
    name = signal('Jane Doe');
    src = signal('');
    size = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
    variant = signal<'teal' | 'blue' | 'purple' | 'warm' | 'neutral'>('teal');
    online = signal<boolean | null>(null);
    square = signal(false);
}

describe('ZyraAvatar', () => {
    let fixture: ComponentFixture<AvatarHostComponent>;
    let host: AvatarHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AvatarHostComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(AvatarHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Initials ──────────────────────────────────────────────────────────
    it('renders two-letter initials from first and last name', () => {
        expect(
            fixture.nativeElement.querySelector('.zyr-avatar__initials').textContent.trim(),
        ).toBe('JD');
    });

    it('renders first two chars for a single-word name', () => {
        host.name.set('Alice');
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector('.zyr-avatar__initials').textContent.trim(),
        ).toBe('AL');
    });

    it('renders ? when name is empty', () => {
        host.name.set('');
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector('.zyr-avatar__initials').textContent.trim(),
        ).toBe('?');
    });

    it('uses first and last parts for multi-word names', () => {
        host.name.set('John Paul Smith');
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector('.zyr-avatar__initials').textContent.trim(),
        ).toBe('JS');
    });

    // ── Image ─────────────────────────────────────────────────────────────
    it('renders an img when src is provided', () => {
        host.src.set('https://example.com/avatar.png');
        fixture.detectChanges();
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-avatar__img');
        expect(img).not.toBeNull();
        expect(img.src).toContain('avatar.png');
    });

    it('falls back to initials when image fails to load', () => {
        host.src.set('broken.png');
        fixture.detectChanges();
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-avatar__img');
        img.dispatchEvent(new Event('error'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-avatar__img')).toBeNull();
        expect(fixture.nativeElement.querySelector('.zyr-avatar__initials')).not.toBeNull();
    });

    // ── Status indicator ──────────────────────────────────────────────────
    it('shows online status dot', () => {
        host.online.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-avatar__status--online')).not.toBeNull();
    });

    it('shows offline status dot', () => {
        host.online.set(false);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-avatar__status--offline')).not.toBeNull();
    });

    it('hides status dot when online is null', () => {
        expect(fixture.nativeElement.querySelector('.zyr-avatar__status')).toBeNull();
    });

    it('status dot has aria-label Online when online', () => {
        host.online.set(true);
        fixture.detectChanges();
        const dot: HTMLElement = fixture.nativeElement.querySelector('.zyr-avatar__status');
        expect(dot.getAttribute('aria-label')).toBe('Online');
    });

    it('status dot has aria-label Offline when offline', () => {
        host.online.set(false);
        fixture.detectChanges();
        const dot: HTMLElement = fixture.nativeElement.querySelector('.zyr-avatar__status');
        expect(dot.getAttribute('aria-label')).toBe('Offline');
    });

    // ── Classes ───────────────────────────────────────────────────────────
    it('applies size class', () => {
        host.size.set('xl');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-avatar--xl')).not.toBeNull();
    });

    it('applies variant class', () => {
        host.variant.set('purple');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-avatar--purple')).not.toBeNull();
    });

    it('applies square class when square is true', () => {
        host.square.set(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.zyr-avatar--square')).not.toBeNull();
    });

    it('does not apply square class by default', () => {
        expect(fixture.nativeElement.querySelector('.zyr-avatar--square')).toBeNull();
    });

    // ── Accessibility ─────────────────────────────────────────────────────
    it('sets aria-label to "Avatar for <name>"', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-avatar');
        expect(el.getAttribute('aria-label')).toBe('Avatar for Jane Doe');
    });

    it('sets aria-label to "Avatar" when name is empty', () => {
        host.name.set('');
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector('.zyr-avatar');
        expect(el.getAttribute('aria-label')).toBe('Avatar');
    });
});

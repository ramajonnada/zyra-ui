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
            [online]="online()"
            [square]="square()"
            variant="neutral"
        ></zyra-avatar>
    `,
})
class AvatarHostComponent {
    name = signal('Jane Doe');
    src = signal('');
    online = signal<boolean | null>(true);
    square = signal(true);
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

    it('renders initials and status state for text avatars', () => {
        const avatar: HTMLElement = fixture.nativeElement.querySelector('.zyr-avatar');

        expect(avatar.className).toContain('zyr-avatar--neutral');
        expect(avatar.className).toContain('zyr-avatar--square');
        expect(avatar.textContent).toContain('JD');
        expect(
            fixture.nativeElement.querySelector('.zyr-avatar__status--online'),
        ).not.toBeNull();
    });

    it('falls back to initials when the image fails to load', () => {
        host.src.set('broken-image.png');
        fixture.detectChanges();

        const image: HTMLImageElement = fixture.nativeElement.querySelector('.zyr-avatar__img');
        image.dispatchEvent(new Event('error'));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.zyr-avatar__img')).toBeNull();
        expect(fixture.nativeElement.textContent).toContain('JD');
    });
});

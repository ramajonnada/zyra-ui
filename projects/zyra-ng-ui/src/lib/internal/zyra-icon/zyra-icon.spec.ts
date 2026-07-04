import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraIcon, ZyraIconData } from './zyra-icon';

const CHECK_ICON: ZyraIconData = [['path', { d: 'M20 6 9 17l-5-5' }]];
const X_ICON: ZyraIconData = [
    ['path', { d: 'M18 6 6 18' }],
    ['path', { d: 'm6 6 12 12' }],
];

@Component({
    standalone: true,
    imports: [ZyraIcon],
    template: `<zyra-icon [img]="img()" [size]="size()" />`,
})
class IconHostComponent {
    img = signal<ZyraIconData | null>(CHECK_ICON);
    size = signal(24);
}

describe('ZyraIcon', () => {
    let fixture: ComponentFixture<IconHostComponent>;
    let host: IconHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [IconHostComponent] }).compileComponents();
        fixture = TestBed.createComponent(IconHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('renders an svg with the icon paths', () => {
        const svg: SVGSVGElement = fixture.nativeElement.querySelector('zyra-icon svg');
        expect(svg).not.toBeNull();
        expect(svg.querySelectorAll('path').length).toBe(1);
    });

    it('applies the size input to width and height', () => {
        host.size.set(32);
        fixture.detectChanges();
        const svg: SVGSVGElement = fixture.nativeElement.querySelector('zyra-icon svg');
        expect(svg.getAttribute('width')).toBe('32');
        expect(svg.getAttribute('height')).toBe('32');
    });

    it('marks the svg as aria-hidden', () => {
        const svg: SVGSVGElement = fixture.nativeElement.querySelector('zyra-icon svg');
        expect(svg.getAttribute('aria-hidden')).toBe('true');
    });

    it('re-renders when the icon data changes', () => {
        host.img.set(X_ICON);
        fixture.detectChanges();
        const svg: SVGSVGElement = fixture.nativeElement.querySelector('zyra-icon svg');
        expect(svg.querySelectorAll('path').length).toBe(2);
    });

    it('renders nothing when img is null', () => {
        host.img.set(null);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('zyra-icon svg')).toBeNull();
    });
});

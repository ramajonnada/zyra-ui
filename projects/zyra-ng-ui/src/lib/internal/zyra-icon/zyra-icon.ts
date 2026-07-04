import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    OnChanges,
    Renderer2,
} from '@angular/core';

export type ZyraIconData = [tag: string, attrs: Record<string, string>][];

const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_DEFAULTS: Record<string, string> = {
    xmlns: SVG_NS,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
};

@Component({
    selector: 'zyra-icon',
    standalone: true,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZyraIcon implements OnChanges {
    private readonly el = inject(ElementRef<HTMLElement>);
    private readonly renderer = inject(Renderer2);

    img = input<ZyraIconData | null>(null);
    size = input<number>(24);

    ngOnChanges(): void {
        this._render();
    }

    private _render(): void {
        const host = this.el.nativeElement;
        while (host.firstChild) {
            this.renderer.removeChild(host, host.firstChild);
        }
        const data = this.img();
        if (!data) return;

        const s = String(this.size());
        const svg = this.renderer.createElement('svg', SVG_NS);
        for (const [k, v] of Object.entries(SVG_DEFAULTS)) {
            this.renderer.setAttribute(svg, k, v);
        }
        this.renderer.setAttribute(svg, 'width', s);
        this.renderer.setAttribute(svg, 'height', s);
        this.renderer.setAttribute(svg, 'aria-hidden', 'true');

        for (const [tag, attrs] of data) {
            const child = this.renderer.createElement(tag, SVG_NS);
            for (const [k, v] of Object.entries(attrs)) {
                if (k === 'key') continue;
                this.renderer.setAttribute(child, k, String(v));
            }
            this.renderer.appendChild(svg, child);
        }
        this.renderer.appendChild(host, svg);
    }
}

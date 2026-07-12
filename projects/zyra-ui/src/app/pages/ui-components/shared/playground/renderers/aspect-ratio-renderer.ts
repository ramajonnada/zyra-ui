import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraAspectRatio } from 'zyra-ng-ui';

// Fixed 4:3 photo-like source (a circle inscribed in a frame) so that
// switching `objectFit` visibly crops (cover), letterboxes (contain), or
// stretches (fill) the circle against the container's chosen `ratio`.
const DEMO_IMAGE_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#6d5bd0" />
        <circle cx="200" cy="150" r="110" fill="#a996f0" />
        <rect x="8" y="8" width="384" height="284" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="10 8" />
        <text x="200" y="158" font-family="monospace" font-size="22" fill="#1a1330" text-anchor="middle">400x300</text>
    </svg>
`;
const DEMO_IMAGE_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(DEMO_IMAGE_SVG)}`;

@Component({
    selector: 'pg-aspect-ratio-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraAspectRatio],
    styles: [
        `
            :host {
                display: block;
                width: 100%;
                max-width: 320px;
            }
        `,
    ],
    template: `
        <zyra-aspect-ratio [ratio]="$any(ratio())" [objectFit]="$any(objectFit())">
            <img [src]="imageSrc" alt="400 by 300 demo image" />
        </zyra-aspect-ratio>
    `,
})
export class AspectRatioRenderer {
    ratio = input<string>('16/9');
    objectFit = input<string>('cover');
    protected readonly imageSrc = DEMO_IMAGE_SRC;
}

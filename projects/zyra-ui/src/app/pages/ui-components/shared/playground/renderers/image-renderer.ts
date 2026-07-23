import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraImage } from 'zyra-ng-ui';

@Component({
    selector: 'pg-image-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraImage],
    template: `
        <div style="width: 260px;">
            <zyra-image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
                alt="Mountain landscape at sunrise"
                ratio="16/9"
                [objectFit]="$any(objectFit())"
                [radius]="$any(radius())"
                [caption]="caption() ? 'Sunrise over the mountains' : ''"
            />
        </div>
    `,
})
export class ImageRenderer {
    objectFit = input<string>('cover');
    radius = input<string>('md');
    caption = input<boolean>(true);
}

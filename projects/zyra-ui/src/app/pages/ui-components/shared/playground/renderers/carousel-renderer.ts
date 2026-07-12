import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraAspectRatio, ZyraCarousel, ZyraCarouselSlide } from 'zyra-ng-ui';

const SLIDE_ACCENTS = ['#18d5ea', '#a78bfa', '#f59e0b', '#34d399'];

@Component({
    selector: 'pg-carousel-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraCarousel, ZyraCarouselSlide, ZyraAspectRatio],
    styles: [
        ':host { display: block; width: 100%; max-width: 480px; }',
        '.pg-carousel-demo__pad { padding: 32px 56px; }',
        '.pg-carousel-demo__card { display:flex; align-items:center; justify-content:center; width:100%; height:100%; border-radius: var(--zyra-radius-lg); border: 1px solid var(--zyra-color-border); box-shadow: var(--zyra-shadow-md); font-family: var(--zyra-font-mono); font-size: 40px; font-weight: 700; color: #0b0f14; }',
    ],
    template: `
        <zyra-carousel [loop]="loop()" [autoplay]="autoplay()" [showDots]="showDots()">
            @for (n of [1, 2, 3, 4]; track n) {
                <zyra-carousel-slide>
                    <div class="pg-carousel-demo__pad">
                        <zyra-aspect-ratio ratio="16/10">
                            <div
                                class="pg-carousel-demo__card"
                                [style.background]="accent(n)"
                            >
                                {{ n }}
                            </div>
                        </zyra-aspect-ratio>
                    </div>
                </zyra-carousel-slide>
            }
        </zyra-carousel>
    `,
})
export class CarouselRenderer {
    loop = input<boolean>(true);
    autoplay = input<boolean>(false);
    showDots = input<boolean>(true);

    accent(n: number): string {
        return SLIDE_ACCENTS[(n - 1) % SLIDE_ACCENTS.length];
    }
}

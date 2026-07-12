import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'zyra-carousel-slide',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'zyr-carousel__slide', role: 'group', 'aria-roledescription': 'slide' },
    template: '<ng-content />',
})
export class ZyraCarouselSlide {}

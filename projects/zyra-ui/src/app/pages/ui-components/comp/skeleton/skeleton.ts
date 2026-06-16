import { Component, signal } from '@angular/core';
import { ZyraSkeleton, ZyraCard } from 'zyra-ng-ui';

@Component({
    selector: 'app-skeleton',
    standalone: true,
    imports: [ZyraSkeleton, ZyraCard],
    templateUrl: './skeleton.html',
    styleUrl: './skeleton.scss',
})
export class Skeleton {
    animated = signal(true);
}

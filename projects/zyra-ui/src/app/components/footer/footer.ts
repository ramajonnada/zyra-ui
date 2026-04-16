import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBadge } from 'zyra-ng-ui';

@Component({
    selector: 'app-footer',
    imports: [RouterLink, ZyraBadge],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {}

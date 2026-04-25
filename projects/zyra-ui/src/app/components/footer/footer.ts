import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { ZyraBadge } from 'zyra-ng-ui';
import { appIcons } from '../../shared/fontawesome-icons';

@Component({
    selector: 'app-footer',
    imports: [RouterLink, ZyraBadge, FaIconComponent],
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer {
    readonly icons = appIcons;
}

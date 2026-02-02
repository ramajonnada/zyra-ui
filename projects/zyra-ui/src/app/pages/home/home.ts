import { Component, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraButton, ZyraInput } from 'zyra-ng-ui';

@Component({
	selector: 'app-home',
	imports: [ZyraButton, ZyraInput],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	isDesable: Signal<boolean> = signal(false);
}

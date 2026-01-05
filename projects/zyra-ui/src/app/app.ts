import { Component, OnInit, signal } from '@angular/core';

@Component({
	selector: 'app-root',
	imports: [],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App implements OnInit {
	protected readonly title = signal('zyra-ui');

	ngOnInit() {
		console.log('app intialized');
	}
}

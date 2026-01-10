import { Component, OnInit, signal } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { Header } from './components/header/header';
// import { Footer } from './components/footer/footer';
import { ZyraButton, ThemeService } from 'zyra-ng-ui';

@Component({
	selector: 'app-root',
	// imports: [RouterModule,Header,Footer,],
	imports: [ZyraButton],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App implements OnInit {
	protected readonly title = signal('zyra-ui');

	constructor(private theme: ThemeService
	) { }

	ngOnInit() {
		this.theme.initTheme();
	}
}

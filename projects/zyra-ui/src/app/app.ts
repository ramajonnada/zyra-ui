import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
	selector: 'app-root',
	imports: [RouterModule,Header,Footer],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App implements OnInit {
	protected readonly title = signal('zyra-ui');

	ngOnInit() {
		console.log('app intialized');
	}
}

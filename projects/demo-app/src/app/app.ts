import { Component, signal } from '@angular/core';
import { Button } from 'zyra-ui';
@Component({
	selector: 'app-root',
	imports: [Button],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected readonly title = signal('demo-app');
}

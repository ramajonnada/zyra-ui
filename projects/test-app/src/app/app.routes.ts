import { Routes } from '@angular/router';
import { TestButton } from './test-button/test-button';
import { CardTest } from './card-test/card-test';

export const routes: Routes = [
	{
		path: 'button', component: TestButton
	},
	{
		path: 'card', component: CardTest
	},
	// {
		// path: '', component: 
	// }
];

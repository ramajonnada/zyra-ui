import { Routes } from '@angular/router';
import { TestButton } from './test-button/test-button';
import { CardTest } from './card-test/card-test';
import { Badge } from './badge/badge';
import { Tooltip } from './tooltip/tooltip';
import { Input } from './input/input';

export const routes: Routes = [
	{
		path: 'button', component: TestButton
	},
	{
		path: 'card', component: CardTest
	},
	{
		path: 'badge', component: Badge
	},
	{
		path: 'tooltip', component: Tooltip
	},
	{
		path: 'inputcomp', component: Input
	}
];

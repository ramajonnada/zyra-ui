import { Routes } from '@angular/router';
import { Button } from './comp/button/button';
import { CardTest } from './comp/card-test/card-test';
import { Badge } from './comp/badge/badge';
import { Tooltip } from './comp/tooltip/tooltip';
import { Input } from './comp/input/input';
import { Spinner } from './comp/spinner/spinner';
import { Toast } from './comp/toast/toast';
import { Avatar } from './comp/avatar/avatar';

export const routes: Routes = [
	{
		path: 'button', component: Button
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
	},
	{
		path: 'spinner', component: Spinner
	},
	{
		path: 'toast', component: Toast
	},
	{
		path: 'avatar', component: Avatar
	}
];

import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Docs } from './pages/docs/docs';
import { Login } from './pages/login/login';
import { About } from './pages/about/about';
import { UiComponents } from './pages/ui-components/ui-components';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home').then(() => Home),
	},
	{
		path: 'comp',
		loadComponent: () => import('./pages/ui-components/ui-components').then(() => UiComponents),
	},
	{
		path: 'blog-page',
		loadComponent: () => import('./pages/blog-list/blog-list').then((m) => m.BlogList),
	},
	{
		path: 'blog/:slug',
		loadComponent: () => import('./blog/blog-details/blog-details').then((m) => m.BlogDetails),
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login').then(() => Login),
	},
	{
		path: 'docs',
		loadComponent: () => import('./pages/docs/docs').then(() => Docs),
	},
	{
		path: 'about',
		loadComponent: () => import('./pages/about/about').then(() => About),
	},
	{
		path: 'contact',
		loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
	},
];

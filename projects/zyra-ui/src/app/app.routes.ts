import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Docs } from './pages/docs/docs';
import { Login } from './pages/login/login';
import { About } from './pages/about/about';
import { UiComponents } from './pages/ui-components/ui-components';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';
import { TermsOfServices } from './components/terms-of-services/terms-of-services';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home').then(() => Home),
	},
	{
		path: 'components',
		loadComponent: () => import('./pages/ui-components/ui-components').then(() => UiComponents),
	},
	{
		path: 'blog-list',
		loadComponent: () => import('./blog/blog-list/blog-list').then((m) => m.BlogList),
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
	{
		path: 'privacy-and-policy',
		loadComponent: () => import('./components/privacy-policy/privacy-policy').then(() => PrivacyPolicy),
	},
	{
		path: 'termsofservices',
		loadComponent: () => import('./components/terms-of-services/terms-of-services').then(() => TermsOfServices),
	},

];

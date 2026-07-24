import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home').then((m) => m.Home),
	},

	{
		path: 'blog',
		loadChildren: () => import('./blog/blog.routes').then((m) => m.BLOG_ROUTES),
	},
	{
		path: 'docs',
		loadComponent: () => import('./pages/docs/docs').then((m) => m.Docs),
	},
	{
		path: 'docs/installation',
		loadComponent: () =>
			import('./pages/docs/installation/installation').then((m) => m.DocsInstallation),
	},
	{
		path: 'docs/components',
		loadComponent: () =>
			import('./pages/ui-components/ui-components').then((m) => m.UiComponents),
	},
	{
		path: 'docs/components/:component',
		loadComponent: () =>
			import('./pages/ui-components/ui-component-detail').then((m) => m.UiComponentDetail),
	},
	{
		path: 'docs/theming',
		loadComponent: () => import('./pages/docs/theming/theming').then((m) => m.DocsTheming),
	},
	{
		path: 'docs/theme-tokens',
		loadComponent: () =>
			import('./pages/docs/theme-tokens/theme-tokens').then((m) => m.DocsThemeTokens),
	},
	{
		path: 'docs/accessibility',
		loadComponent: () =>
			import('./pages/docs/accessibility/accessibility').then((m) => m.DocsAccessibility),
	},
	{
		path: 'docs/compatibility',
		loadComponent: () =>
			import('./pages/docs/compatibility/compatibility').then((m) => m.DocsCompatibility),
	},
	{
		path: 'docs/roadmap',
		loadComponent: () => import('./pages/docs/roadmap/roadmap').then((m) => m.DocsRoadmap),
	},
	{
		path: 'theming',
		redirectTo: 'docs/theming',
		pathMatch: 'full',
	},
	{
		path: 'components',
		redirectTo: 'docs/components',
		pathMatch: 'full',
	},
	{
		path: 'components/:component',
		redirectTo: 'docs/components/:component',
	},
	{
		path: 'about',
		loadComponent: () => import('./pages/about/about').then((m) => m.About),
	},
	{
		path: 'contact',
		loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
	},
	{
		path: 'changelog',
		loadComponent: () => import('./pages/changelog/changelog').then((m) => m.Changelog),
	},
	{
		path: 'privacy',
		loadComponent: () =>
			import('./components/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy),
	},
	{
		path: 'terms',
		loadComponent: () =>
			import('./components/terms-of-services/terms-of-services').then(
				(m) => m.TermsOfServices,
			),
	},
	{
		path: 'privacy-and-policy',
		redirectTo: 'privacy',
		pathMatch: 'full',
	},
	{
		path: 'termsofservices',
		redirectTo: 'terms',
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: '',
	},
];

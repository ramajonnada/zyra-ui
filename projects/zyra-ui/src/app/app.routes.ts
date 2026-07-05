import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    },
    {
        path: 'components',
        loadComponent: () =>
            import('./pages/ui-components/ui-components').then((m) => m.UiComponents),
    },
    {
        path: 'components/:component',
        loadComponent: () =>
            import('./pages/ui-components/ui-component-detail').then((m) => m.UiComponentDetail),
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
        path: 'theming',
        loadComponent: () => import('./pages/theming/theming').then((m) => m.Theming),
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

import { Routes } from '@angular/router';
import type { RouteSeoData } from './services/seo.service';

const HOME_SEO = {
    title: 'Zyra UI - Modern Angular UI Library',
    description:
        'Build polished Angular apps faster with Zyra UI components, token-driven theming, and standalone-first APIs.',
    keywords: ['Angular UI library', 'Angular components', 'standalone Angular UI', 'Zyra UI'],
} satisfies RouteSeoData;

const COMPONENTS_SEO = {
    title: 'Angular UI Components Showcase | Zyra UI',
    description:
        'Explore reusable Angular UI components from Zyra UI, including buttons, forms, tooltips, toasts, cards, and more.',
    keywords: ['Angular UI components', 'Angular design system', 'Angular component library'],
} satisfies RouteSeoData;

const COMPONENT_DETAIL_SEO = {
    title: 'Angular Component Examples | Zyra UI',
    description:
        'Browse Angular component examples, usage patterns, and live previews for Zyra UI building blocks.',
} satisfies RouteSeoData;

const BLOG_LIST_SEO = {
    title: 'Angular Blog and Guides | Zyra UI',
    description:
        'Read Angular guides, signals deep dives, performance tips, and frontend architecture articles from Zyra UI.',
    keywords: ['Angular blog', 'Angular signals', 'Angular SEO', 'frontend architecture'],
} satisfies RouteSeoData;

const BLOG_DETAIL_SEO = {
    title: 'Angular Article | Zyra UI',
    description:
        'Read practical Angular tutorials, migration notes, and performance-focused guides from Zyra UI.',
    type: 'article',
} satisfies RouteSeoData;

const DOCS_SEO = {
    title: 'Angular UI Library Docs | Zyra UI',
    description:
        'Install Zyra UI, register the provider, and start building with standalone Angular UI components and tokens.',
    keywords: ['Zyra UI docs', 'Angular UI documentation', 'provideZyra', 'Angular setup guide'],
} satisfies RouteSeoData;

const ABOUT_SEO = {
    title: 'About Zyra UI',
    description:
        'Learn what Zyra UI is building for modern Angular teams, from reusable components to consistent design tokens.',
} satisfies RouteSeoData;

const CONTACT_SEO = {
    title: 'Contact Zyra UI',
    description:
        'Get in touch with Zyra UI for questions, feedback, collaboration ideas, or library-related support.',
} satisfies RouteSeoData;

const LOGIN_SEO = {
    title: 'Login | Zyra UI',
    description: 'Sign in to your Zyra UI account.',
    robots: 'noindex,follow',
} satisfies RouteSeoData;

const PRIVACY_SEO = {
    title: 'Privacy Policy | Zyra UI',
    description: 'Review the Zyra UI privacy policy and learn how website and product data is handled.',
} satisfies RouteSeoData;

const TERMS_SEO = {
    title: 'Terms of Service | Zyra UI',
    description: 'Read the Zyra UI terms of service for site usage, licensing, and general conditions.',
} satisfies RouteSeoData;

export const routes: Routes = [
    {
        path: '',
        data: { seo: HOME_SEO },
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    },
    {
        path: 'components',
        data: { seo: COMPONENTS_SEO },
        loadComponent: () =>
            import('./pages/ui-components/ui-components').then((m) => m.UiComponents),
    },
    {
        path: 'components/:component',
        data: { seo: COMPONENT_DETAIL_SEO },
        loadComponent: () =>
            import('./pages/ui-components/ui-component-detail').then((m) => m.UiComponentDetail),
    },
    {
        path: 'blog-list',
        data: { seo: BLOG_LIST_SEO },
        loadComponent: () => import('./blog/blog-list/blog-list').then((m) => m.BlogList),
    },
    {
        path: 'blog/:slug',
        data: { seo: BLOG_DETAIL_SEO },
        loadComponent: () => import('./blog/blog-details/blog-details').then((m) => m.BlogDetails),
    },
    {
        path: 'login',
        data: { seo: LOGIN_SEO },
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    },
    {
        path: 'docs',
        data: { seo: DOCS_SEO },
        loadComponent: () => import('./pages/docs/docs').then((m) => m.Docs),
    },
    {
        path: 'about',
        data: { seo: ABOUT_SEO },
        loadComponent: () => import('./pages/about/about').then((m) => m.About),
    },
    {
        path: 'contact',
        data: { seo: CONTACT_SEO },
        loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    },
    {
        path: 'privacy-and-policy',
        data: { seo: PRIVACY_SEO },
        loadComponent: () =>
            import('./components/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy),
    },
    {
        path: 'termsofservices',
        data: { seo: TERMS_SEO },
        loadComponent: () =>
            import('./components/terms-of-services/terms-of-services').then(
                (m) => m.TermsOfServices,
            ),
    },
];

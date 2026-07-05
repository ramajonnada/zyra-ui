import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

export const BLOG_ROUTES: Routes = [
    {
        path: '',
        providers: [importProvidersFrom(MarkdownModule.forRoot())],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./blog-list/blog-list').then((m) => m.BlogList),
            },
            {
                path: ':slug',
                loadComponent: () =>
                    import('./blog-details/blog-details').then((m) => m.BlogDetails),
            },
        ],
    },
];

import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { MarkdownModule, MARKED_EXTENSIONS } from 'ngx-markdown';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);

export const BLOG_ROUTES: Routes = [
    {
        path: '',
        providers: [
            importProvidersFrom(MarkdownModule.forRoot()),
            {
                provide: MARKED_EXTENSIONS,
                useValue: markedHighlight({
                    langPrefix: 'hljs language-',
                    highlight(code, lang) {
                        const language = hljs.getLanguage(lang) ? lang : 'typescript';
                        return hljs.highlight(code, { language }).value;
                    },
                }),
                multi: true,
            },
        ],
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

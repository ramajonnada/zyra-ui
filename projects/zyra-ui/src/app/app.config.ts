import {
    ApplicationConfig,
    importProvidersFrom,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MarkdownModule, MARKED_EXTENSIONS } from 'ngx-markdown';
import { provideZyra } from 'zyra-ng-ui';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'top',
            }),
        ),
        provideClientHydration(withEventReplay()),
        provideHttpClient(withFetch()),
        importProvidersFrom(MarkdownModule.forRoot()),
        {
            provide: MARKED_EXTENSIONS,
            useValue: markedHighlight({
                langPrefix: 'hljs language-',
                highlight(code, lang) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                },
            }),
            multi: true,
        },
        provideZyra({ theme: 'light' }),
    ],
};

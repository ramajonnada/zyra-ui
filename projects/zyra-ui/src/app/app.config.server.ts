import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { BLOG_CONTENT_LOADER, BLOG_POSTS_LOADER, PostMeta } from './services/blog-service';

const contentDir = join(process.cwd(), 'projects', 'zyra-ui', 'src', 'content');

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(withRoutes(serverRoutes)),
        {
            provide: BLOG_POSTS_LOADER,
            useValue: async (): Promise<PostMeta[]> =>
                JSON.parse(await readFile(join(contentDir, 'index.json'), 'utf-8')) as PostMeta[],
        },
        {
            provide: BLOG_CONTENT_LOADER,
            useValue: (slug: string): Promise<string> =>
                readFile(join(contentDir, `${slug}.md`), 'utf-8'),
        },
    ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

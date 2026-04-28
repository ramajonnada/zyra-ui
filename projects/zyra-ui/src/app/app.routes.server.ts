import { RenderMode, ServerRoute } from '@angular/ssr';
import { getAllSlugs } from './prerender/blog-prerender-utils';
import { UI_COMPONENT_SHOWCASE } from './pages/ui-components/ui-components.data';

export const serverRoutes: ServerRoute[] = [
    { path: '', renderMode: RenderMode.Prerender },
    { path: 'docs', renderMode: RenderMode.Prerender },
    { path: 'blog', renderMode: RenderMode.Prerender },
    {
        path: 'blog/:slug',
        renderMode: RenderMode.Prerender,
        async getPrerenderParams(): Promise<Record<string, string>[]> {
            // This must return Promise<string[]>
            const slugs = await getAllSlugs();
            console.log('Prerendering blog slugs:', slugs);
            // This returns Promise<Record<string,string>[]>
            return slugs.map((slug) => ({ slug }));
        },
    },
    { path: 'components', renderMode: RenderMode.Prerender },
    {
        path: 'components/:component',
        renderMode: RenderMode.Prerender,
        async getPrerenderParams(): Promise<Record<string, string>[]> {
            return UI_COMPONENT_SHOWCASE.map((component) => ({ component: component.slug }));
        },
    },
    { path: 'about', renderMode: RenderMode.Prerender },
    { path: 'contact', renderMode: RenderMode.Prerender },

    { path: 'login', renderMode: RenderMode.Server },
    { path: 'privacy-and-policy', renderMode: RenderMode.Server },
    { path: 'termsofservices', renderMode: RenderMode.Server },
];

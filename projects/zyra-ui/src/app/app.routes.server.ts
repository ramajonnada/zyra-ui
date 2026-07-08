import { RenderMode, ServerRoute } from '@angular/ssr';
import { getAllSlugs } from './prerender/blog-prerender-utils';
import { UI_COMPONENT_SHOWCASE } from './pages/ui-components/ui-components.data';

export const serverRoutes: ServerRoute[] = [
    { path: '', renderMode: RenderMode.Prerender },
    { path: 'docs', renderMode: RenderMode.Prerender },
    { path: 'docs/installation', renderMode: RenderMode.Prerender },
    { path: 'docs/components', renderMode: RenderMode.Prerender },
    { path: 'docs/theming', renderMode: RenderMode.Prerender },
    { path: 'docs/theme-tokens', renderMode: RenderMode.Prerender },
    { path: 'theming', renderMode: RenderMode.Server },
    { path: 'blog', renderMode: RenderMode.Prerender },
    {
        path: 'blog/:slug',
        renderMode: RenderMode.Prerender,
        async getPrerenderParams(): Promise<Record<string, string>[]> {
            const slugs = await getAllSlugs();
            console.log('Prerendering blog slugs:', slugs);
            return slugs.map((slug) => ({ slug }));
        },
    },
    {
        path: 'docs/components/:component',
        renderMode: RenderMode.Prerender,
        async getPrerenderParams(): Promise<Record<string, string>[]> {
            return UI_COMPONENT_SHOWCASE.map((component) => ({ component: component.slug }));
        },
    },
    { path: 'about', renderMode: RenderMode.Prerender },
    { path: 'contact', renderMode: RenderMode.Prerender },
    { path: 'privacy', renderMode: RenderMode.Prerender },
    { path: 'terms', renderMode: RenderMode.Prerender },
    { path: 'privacy-and-policy', renderMode: RenderMode.Server },
    { path: 'termsofservices', renderMode: RenderMode.Server },
    { path: '**', renderMode: RenderMode.Server },
];

import { RenderMode, ServerRoute } from '@angular/ssr';
import { getAllSlugs } from './prerender/blog-prerender-utils';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Prerender },
	{ path: 'docs', renderMode: RenderMode.Prerender },
	{ path: 'blog-page', renderMode: RenderMode.Prerender },
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
	{ path: 'comp', renderMode: RenderMode.Prerender },
	{ path: 'about', renderMode: RenderMode.Prerender },
	{ path: 'contact', renderMode: RenderMode.Prerender },

	{ path: 'login', renderMode: RenderMode.Server },
];

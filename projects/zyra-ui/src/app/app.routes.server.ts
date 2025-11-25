import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { BlogService } from './services/blog-service';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Prerender },
	{ path: 'docs', renderMode: RenderMode.Prerender },
	{ path: 'blog', renderMode: RenderMode.Prerender },
	{
		path: 'blog/:slug',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			const blogService = inject(BlogService);
			const slugs = await blogService.getAllSlugs(); // e.g. ['my-first-post', 'angular-seo']
			return slugs.map(slug => ({ slug }));
		},
	},
	{ path: 'about', renderMode: RenderMode.Prerender },
	{ path: 'contact', renderMode: RenderMode.Prerender },

	{ path: 'login', renderMode: RenderMode.Server }
];

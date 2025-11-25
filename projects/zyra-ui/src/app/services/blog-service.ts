import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class BlogService {
	getAllSlugs(): Promise<string[]> {
		return Promise.resolve(POSTS.map(p => p.slug));
	}

	getAllPosts(): BlogPost[] {
		return POSTS;
	}

	getPostBySlug(slug: string): BlogPost | undefined {
		return POSTS.find(p => p.slug === slug);
	}
}



export interface BlogPost {
	slug: string;
	title: string;
	seoTitle?: string;
	seoDescription: string;
	contentHtml: string; // you can later switch this to markdown->HTML
	publishedAt: string;
}

const POSTS: BlogPost[] = [
	{
		slug: 'my-first-post',
		title: 'My First Post',
		seoTitle: 'My First Post | My Blog',
		seoDescription: 'Intro post about my new Angular blog.',
		contentHtml: '<p>Hello from my first Angular prerendered blog post.</p>',
		publishedAt: '2025-11-25',
	},
];


import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable, of } from 'rxjs';

export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    description: string;
    readTime: string;
    badge?: string;
    tags?: string[];
    keywords?: string[];
    link?: string;
    imageUrl?: string;
    category: string | string[];
}

export type BlogPostsLoader = () => Promise<PostMeta[]>;
export type BlogContentLoader = (slug: string) => Promise<string>;

export const BLOG_POSTS_LOADER = new InjectionToken<BlogPostsLoader>('BLOG_POSTS_LOADER');
export const BLOG_CONTENT_LOADER = new InjectionToken<BlogContentLoader>('BLOG_CONTENT_LOADER');

@Injectable({ providedIn: 'root' })
export class BlogService {
    private readonly http = inject(HttpClient);
    private readonly postsLoader = inject(BLOG_POSTS_LOADER, { optional: true });
    private readonly contentLoader = inject(BLOG_CONTENT_LOADER, { optional: true });

    getAllPosts(): Observable<PostMeta[]> {
        if (this.postsLoader) {
            return from(this.postsLoader()).pipe(catchError(() => of([])));
        }

        return this.http.get<PostMeta[]>('/content/index.json');
    }

    getPostContent(slug: string): Observable<string> {
        if (this.contentLoader) {
            return from(this.contentLoader(slug)).pipe(catchError(() => of('')));
        }

        return this.http.get(`/content/${slug}.md`, { responseType: 'text' });
    }
}

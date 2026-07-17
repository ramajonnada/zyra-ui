import {
    inject,
    Injectable,
    InjectionToken,
    makeStateKey,
    PendingTasks,
    TransferState,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, from, Observable, of, tap } from 'rxjs';

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
    faq?: { q: string; a: string }[];
}

export type BlogPostsLoader = () => Promise<PostMeta[]>;
export type BlogContentLoader = (slug: string) => Promise<string>;

export const BLOG_POSTS_LOADER = new InjectionToken<BlogPostsLoader>('BLOG_POSTS_LOADER');
export const BLOG_CONTENT_LOADER = new InjectionToken<BlogContentLoader>('BLOG_CONTENT_LOADER');

@Injectable({ providedIn: 'root' })
export class BlogService {
    private readonly http = inject(HttpClient);
    private readonly pendingTasks = inject(PendingTasks);
    private readonly transferState = inject(TransferState);
    private readonly postsLoader = inject(BLOG_POSTS_LOADER, { optional: true });
    private readonly contentLoader = inject(BLOG_CONTENT_LOADER, { optional: true });

    private readonly postsKey = makeStateKey<PostMeta[]>('blog-posts');

    getAllPosts(): Observable<PostMeta[]> {
        // The server reads posts straight off disk (bypassing HttpClient), so
        // Angular's automatic HTTP transfer cache never sees this request.
        // Without this, the client re-fetches over the network on hydration,
        // flashing the loading state over the already-rendered SSR content.
        const cached = this.transferState.get(this.postsKey, null);
        if (cached) {
            this.transferState.remove(this.postsKey);
            return of(cached);
        }

        if (this.postsLoader) {
            // Register the async file read as a pending task so zoneless SSR
            // waits for it before serializing the HTML (otherwise the list
            // renders empty for crawlers).
            const removeTask = this.pendingTasks.add();
            return from(this.postsLoader()).pipe(
                tap((posts) => this.transferState.set(this.postsKey, posts)),
                catchError(() => of([])),
                finalize(() => removeTask()),
            );
        }

        return this.http.get<PostMeta[]>('/content/index.json');
    }

    getPostContent(slug: string): Observable<string> {
        const key = makeStateKey<string>(`blog-content-${slug}`);
        const cached = this.transferState.get(key, null);
        if (cached !== null) {
            this.transferState.remove(key);
            return of(cached);
        }

        if (this.contentLoader) {
            const removeTask = this.pendingTasks.add();
            return from(this.contentLoader(slug)).pipe(
                tap((md) => this.transferState.set(key, md)),
                catchError(() => of('')),
                finalize(() => removeTask()),
            );
        }

        return this.http.get(`/content/${slug}.md`, { responseType: 'text' });
    }
}

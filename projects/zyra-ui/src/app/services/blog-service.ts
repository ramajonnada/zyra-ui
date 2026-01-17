import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    description: string;
    readTime: string;
    badge?: string;
    tags?: string[];
    link?: string;
    category: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
    private http: HttpClient = inject(HttpClient);

    getAllPosts(): Observable<PostMeta[]> {
        return this.http.get<PostMeta[]>('/content/index.json');
    }

    getPostContent(slug: string): Observable<string> {
        return this.http.get(`/content/${slug}.md`, { responseType: 'text' });
    }
}

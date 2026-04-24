import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class BlogService {
    private http: HttpClient = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    getAllPosts(): Observable<PostMeta[]> {
        return this.http.get<PostMeta[]>('/content/index.json');
    }

    getPostContent(slug: string): Observable<string> {
        if (isPlatformServer(this.platformId)) {
            // On server, read from file system
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const fs = require('fs');
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const path = require('path');
            const filePath = path.join(
                process.cwd(),
                'projects',
                'zyra-ui',
                'src',
                'content',
                `${slug}.md`,
            );
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                return of(content);
            } catch {
                return of(''); // or throw
            }
        } else {
            // On client, use HTTP
            return this.http.get(`/content/${slug}.md`, { responseType: 'text' });
        }
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PostMeta {
	slug: string;
	title: string;
	date: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
	constructor(private http: HttpClient) { }

	getAllPosts(): Observable<PostMeta[]> {
		return this.http.get<PostMeta[]>('/content/index.json');
	}

	getPostContent(slug: string): Observable<string> {
		return this.http.get(`/content/${slug}.md`, { responseType: 'text' });
	}
}

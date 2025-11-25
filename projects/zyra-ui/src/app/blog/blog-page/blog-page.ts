import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogPost, BlogService } from '../../services/blog-service';

@Component({
	selector: 'app-blog-page',
	imports: [],
	templateUrl: './blog-page.html',
	styleUrl: './blog-page.scss',
})
export class BlogPage {


	post?: BlogPost;

	constructor(private route: ActivatedRoute,
		private blogService: BlogService,
		private title: Title,
		private meta: Meta
	) {

	}

	ngOnInit() {
		const slug = this.route.snapshot.paramMap.get('slug')!;
		const post = this.blogService.getPostBySlug(slug);
		if (!post) return;

		this.post = post;

		const fullTitle = post.seoTitle || post.title;
		this.title.setTitle(fullTitle);
		this.meta.updateTag({ name: 'description', content: post.seoDescription });
		this.meta.updateTag({ property: 'og:title', content: fullTitle });
		this.meta.updateTag({ property: 'og:description', content: post.seoDescription });
		this.meta.updateTag({ property: 'og:type', content: 'article' });
	}
}

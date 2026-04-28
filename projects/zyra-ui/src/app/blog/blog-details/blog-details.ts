import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Title, Meta } from '@angular/platform-browser';
import { BlogService, PostMeta } from '../../services/blog-service';
import { ZyraCard } from 'zyra-ng-ui';
import { timeout } from 'rxjs';

@Component({
	selector: 'app-blog-details',
	standalone: true,
	imports: [CommonModule, MarkdownModule, RouterLink, ZyraCard],
	templateUrl: './blog-details.html',
	styleUrls: ['./blog-details.scss'],
})
export class BlogDetails implements OnInit {
	markdownContent = signal('');
	slug = signal('');
	postTitle = signal('');
	postDescription = signal('');
	postDate = signal('');
	postReadTime = signal('');
	postCategory = signal('Angular');
	postTags = signal<string[]>([]);
	loading = signal(true);
	error = signal('');

	private route = inject(ActivatedRoute);
	private blogService = inject(BlogService);
	private title = inject(Title);
	private meta = inject(Meta);

	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			this.slug.set(params.get('slug')!);
			this.loadPost();
		});
	}

	loadPost() {
		this.loading.set(true);
		this.error.set('');
		this.markdownContent.set('');
		this.postTitle.set('');
		this.postDescription.set('');
		this.postDate.set('');
		this.postReadTime.set('');
		this.postTags.set([]);

		this.blogService
			.getPostContent(this.slug())
			.pipe(timeout(5000))
			.subscribe({
				next: (md) => {
					const titleFromFrontMatter = this.extractFrontMatterValue(md, 'title');
					const descriptionFromFrontMatter = this.extractFrontMatterValue(
						md,
						'description',
					);
					const dateFromFrontMatter = this.extractFrontMatterValue(md, 'date');

					this.postTitle.set(titleFromFrontMatter || this.slug());
					this.postDescription.set(
						descriptionFromFrontMatter || `Read blog post: ${this.postTitle()}`,
					);
					this.postDate.set(dateFromFrontMatter);
					this.markdownContent.set(this.stripIntroBlocks(this.stripFrontMatter(md)));

					this.title.setTitle(`${this.postTitle()} | Zyra UI`);
					this.meta.updateTag({ name: 'description', content: this.postDescription() });
					this.loading.set(false);
				},
				error: (err) => {
					console.error('Error loading post', this.slug(), err);
					this.error.set(
						'Unable to load this article right now. Please try again in a moment.',
					);
					this.loading.set(false);
				},
			});

		this.blogService.getAllPosts().subscribe((posts) => {
			const currentPost = posts.find((post) => post.slug === this.slug());
			if (!currentPost) {
				return;
			}

			this.applyPostMeta(currentPost);
			this.updatePageSEO();
		});
	}

	categoryLabel(): string {
		return this.postCategory() || 'Angular';
	}

	stripFrontMatter(md: string): string {
		return md.replace(/^---[\s\S]*?---/, '').trim();
	}

	private applyPostMeta(post: PostMeta): void {
		if (!this.postTitle()) {
			this.postTitle.set(post.title.trim());
		}

		if (!this.postDescription()) {
			this.postDescription.set(post.description.trim());
		}

		if (!this.postDate()) {
			this.postDate.set(post.date.trim());
		}

		this.postReadTime.set(post.readTime.trim());
		this.postCategory.set(this.toList(post.category)[0] ?? 'Angular');
		this.postTags.set(this.toList(post.tags).slice(0, 6));
	}

	// After applyPostMeta() runs, add this full SEO update:
	private updatePageSEO(): void {
		const url = `https://www.zyraui.dev/blog/${this.slug()}`;
		const fullTitle = `${this.postTitle()} | Zyra UI`;

		this.title.setTitle(fullTitle);
		this.meta.updateTag({ name: 'description', content: this.postDescription() });

		// Open Graph
		this.meta.updateTag({ property: 'og:title', content: fullTitle });
		this.meta.updateTag({ property: 'og:description', content: this.postDescription() });
		this.meta.updateTag({ property: 'og:url', content: url });
		this.meta.updateTag({ property: 'og:type', content: 'article' });

		// Canonical
		let canonical = document.querySelector('link[rel="canonical"]');
		if (!canonical) {
			canonical = document.createElement('link');
			canonical.setAttribute('rel', 'canonical');
			document.head.appendChild(canonical);
		}
		canonical.setAttribute('href', url);
	}

	private extractFrontMatterValue(md: string, key: string): string {
		const match = md.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
		if (!match) {
			return '';
		}

		return match[1].trim().replace(/^['"]|['"]$/g, '');
	}

	private stripIntroBlocks(md: string): string {
		return md
			.replace(/^\s*<div class="blog-meta-row">[\s\S]*?<\/div>\s*/i, '')
			.replace(/^\s*#\s+[^\r\n]+(?:\r?\n)+/i, '')
			.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')
			.trim();
	}

	private toList(value: string | string[] | undefined): string[] {
		if (!value) {
			return [];
		}

		const raw = Array.isArray(value) ? value : [value];
		return raw.map((item) => item.trim()).filter(Boolean);
	}
}

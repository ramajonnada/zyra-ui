import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Title, Meta } from '@angular/platform-browser';
import { BlogService, PostMeta } from '../../services/blog-service';
import { ZyraCard } from 'zyra-ng-ui';

@Component({
	selector: 'app-blog-details',
	standalone: true,
	imports: [CommonModule, MarkdownModule, RouterLink, ZyraCard],
	templateUrl: './blog-details.html',
	styleUrls: ['./blog-details.scss'],
})
export class BlogDetails implements OnInit {
	markdownContent = '';
	slug = '';
	postTitle = '';
	postDescription = '';
	postDate = '';
	postReadTime = '';
	postCategory = 'Angular';
	postTags: string[] = [];
	loading = true;
	error = '';

	private route = inject(ActivatedRoute);
	private blogService = inject(BlogService);
	private title = inject(Title);
	private meta = inject(Meta);

	ngOnInit() {
		this.slug = this.route.snapshot.paramMap.get('slug')!;

		this.blogService.getPostContent(this.slug).subscribe({
			next: (md) => {
				const titleFromFrontMatter = this.extractFrontMatterValue(md, 'title');
				const descriptionFromFrontMatter = this.extractFrontMatterValue(md, 'description');
				const dateFromFrontMatter = this.extractFrontMatterValue(md, 'date');

				this.postTitle = titleFromFrontMatter || this.slug;
				this.postDescription =
					descriptionFromFrontMatter || `Read blog post: ${this.postTitle}`;
				this.postDate = dateFromFrontMatter;
				this.markdownContent = this.stripIntroBlocks(this.stripFrontMatter(md));

				this.title.setTitle(this.postTitle);
				this.meta.updateTag({ name: 'description', content: this.postDescription });
				this.loading = false;
			},
			error: () => {
				this.error = 'Unable to load this article right now. Please try again in a moment.';
				this.loading = false;
			},
		});

		this.blogService.getAllPosts().subscribe((posts) => {
			const currentPost = posts.find((post) => post.slug === this.slug);
			if (!currentPost) {
				return;
			}

			this.applyPostMeta(currentPost);
		});
	}

	categoryLabel(): string {
		return this.postCategory || 'Angular';
	}

	stripFrontMatter(md: string): string {
		return md.replace(/^---[\s\S]*?---/, '').trim();
	}

	private applyPostMeta(post: PostMeta): void {
		if (!this.postTitle) {
			this.postTitle = post.title.trim();
		}

		if (!this.postDescription) {
			this.postDescription = post.description.trim();
		}

		if (!this.postDate) {
			this.postDate = post.date.trim();
		}

		this.postReadTime = post.readTime.trim();
		this.postCategory = this.toList(post.category)[0] ?? 'Angular';
		this.postTags = this.toList(post.tags).slice(0, 6);
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
		return raw
			.map((item) => item.trim())
			.filter(Boolean);
	}
}

import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { BlogService, PostMeta } from '../../services/blog-service';
import { ZyraCard } from 'zyra-ng-ui';
import { timeout } from 'rxjs';
import { SeoService } from '../../services/seo.service';

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
    postKeywords = signal<string[]>([]);
    postImageUrl = signal('');
    loading = signal(true);
    error = signal('');

    private readonly route = inject(ActivatedRoute);
    private readonly blogService = inject(BlogService);
    private readonly seo = inject(SeoService);

    constructor() {
        effect(() => {
            const slug = this.slug();
            const title = this.postTitle();

            if (!slug || !title) {
                return;
            }

            const tags = this.postTags();
            const category = this.postCategory();
            const description = this.postDescription() || `Read blog post: ${title}`;
            const keywords = [...this.postKeywords(), ...tags, category];

            this.seo.apply({
                title: `${title} | Zyra UI Blog`,
                description,
                type: 'article',
                keywords,
                image: this.postImageUrl(),
                canonicalPath: `/blog/${slug}`,
            });
        });
    }

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
        this.postKeywords.set([]);
        this.postImageUrl.set('');

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
        this.postKeywords.set(this.toList(post.keywords).slice(0, 10));
        this.postImageUrl.set(post.imageUrl?.trim() ?? '');
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

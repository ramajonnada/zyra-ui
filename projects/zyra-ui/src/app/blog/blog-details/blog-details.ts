import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { BlogService, PostMeta } from '../../services/blog-service';
import { ZyraBadge, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { timeout } from 'rxjs';
import { Breadcrumb, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb';

@Component({
    selector: 'app-blog-details',
    standalone: true,
    imports: [CommonModule, MarkdownModule, ZyraBadge, ZyraCard, Breadcrumb],
    templateUrl: './blog-details.html',
    styleUrls: ['./blog-details.scss'],
})
export class BlogDetails implements OnDestroy {
    markdownContent = signal('');
    slug = signal('');
    postTitle = signal('');
    postDescription = signal('');
    postDate = signal('');
    postReadTime = signal('');
    postCategory = signal('Angular');
    postTags = signal<string[]>([]);
    postFaq = signal<{ q: string; a: string }[]>([]);
    loading = signal(true);
    error = signal('');

    readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Blog', url: 'https://www.zyraui.dev/blog' },
        { label: this.postTitle() || this.slug(), url: `https://www.zyraui.dev/blog/${this.slug()}` },
    ]);

    private route = inject(ActivatedRoute);
    private blogService = inject(BlogService);
    private seo = inject(SeoService);
    private document = inject(DOCUMENT);
    private el = inject(ElementRef);

    constructor() {
        this.route.paramMap.subscribe((params) => {
            this.slug.set(params.get('slug')!);
            this.loadPost();
        });
    }

    ngOnDestroy() {
        this.seo.removeJsonLd('blog-post-jsonld');
        this.seo.removeJsonLd('blog-faq-jsonld');
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
        this.postFaq.set([]);

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

                    this.updatePageSEO();
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
            if (!currentPost) return;
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
        if (!this.postTitle()) this.postTitle.set(post.title.trim());
        if (!this.postDescription()) this.postDescription.set(post.description.trim());
        if (!this.postDate()) this.postDate.set(post.date.trim());

        this.postReadTime.set(post.readTime.trim());
        this.postCategory.set(this.toList(post.category)[0] ?? 'Angular');
        this.postTags.set(this.toList(post.tags).slice(0, 6));
        this.postFaq.set(Array.isArray(post.faq) ? post.faq : []);
    }

    private updatePageSEO(): void {
        const url = `https://www.zyraui.dev/blog/${this.slug()}`;
        const fullTitle = `${this.postTitle()} | Zyra UI`;

        this.seo.setSEO({
            title: fullTitle,
            description: this.postDescription(),
            url,
            type: 'article',
            publishedTime: this.postDate() || undefined,
            tags: this.postTags(),
        });

        this.seo.injectJsonLd('blog-post-jsonld', {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: this.postTitle(),
            description: this.postDescription(),
            url,
            datePublished: this.postDate() || undefined,
            author: {
                '@type': 'Person',
                name: 'Rama Jonnada',
                url: 'https://www.zyraui.dev/about',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Zyra UI',
                url: 'https://www.zyraui.dev/',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.zyraui.dev/final-icon248.png',
                },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': url,
            },
            keywords: this.postTags().join(', '),
            articleSection: this.postCategory(),
        });

        const faq = this.postFaq();
        if (faq.length) {
            this.seo.injectJsonLd('blog-faq-jsonld', {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faq.map((item) => ({
                    '@type': 'Question',
                    name: item.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.a,
                    },
                })),
            });
        } else {
            this.seo.removeJsonLd('blog-faq-jsonld');
        }
    }

    private extractFrontMatterValue(md: string, key: string): string {
        const match = md.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
        if (!match) return '';
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
        if (!value) return [];
        const raw = Array.isArray(value) ? value : [value];
        return raw.map((item) => item.trim()).filter(Boolean);
    }

    onMarkdownLoad(): void {
        this.enhanceCodeBlocks();
        this.wrapTables();
    }

    private wrapTables(): void {
        const container: HTMLElement = this.el.nativeElement;
        const tables = container.querySelectorAll<HTMLElement>('table:not([data-wrapped])');

        tables.forEach((table) => {
            table.setAttribute('data-wrapped', 'true');
            const wrapper = this.document.createElement('div');
            wrapper.className = 'table-scroll';
            table.parentNode!.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }

    private enhanceCodeBlocks(): void {
        const container: HTMLElement = this.el.nativeElement;
        const blocks = container.querySelectorAll<HTMLElement>('pre:not([data-copy-enhanced])');

        blocks.forEach((pre) => {
            pre.setAttribute('data-copy-enhanced', 'true');

            const code = pre.querySelector('code')?.textContent?.trim() ?? '';
            if (!code) return;

            const btn = this.document.createElement('button');
            btn.className = 'code-copy-btn';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Copy code');
            btn.textContent = 'Copy';

            btn.addEventListener('click', () => {
                navigator.clipboard?.writeText(code).then(() => {
                    btn.textContent = '✓ Copied!';
                    btn.classList.add('code-copy-btn--copied');
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('code-copy-btn--copied');
                    }, 2000);
                });
            });

            pre.appendChild(btn);
        });
    }
}

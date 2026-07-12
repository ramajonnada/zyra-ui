import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBadge, ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { BlogService, PostMeta } from '../../services/blog-service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../shared/breadcrumb-jsonld';

@Component({
    selector: 'app-blog-list',
    imports: [ZyraBadge, ZyraCard, CommonModule, RouterLink, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './blog-list.html',
    styleUrl: './blog-list.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogList implements OnInit, OnDestroy {
    private readonly blogService = inject(BlogService);
    private readonly seo = inject(SeoService);

    readonly loading = signal(true);
    readonly error = signal<string | null>(null);
    readonly posts = signal<PostMeta[]>([]);
    readonly articleCount = computed(() => this.posts().length);

    protected readonly crumbPath = internalPath;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Blog', url: 'https://www.zyraui.dev/blog' },
    ];
    readonly categoryCount = computed(() => {
        const categories = new Set(
            this.posts()
                .map((post) => this.categoryLabel(post.category))
                .filter(Boolean),
        );

        return categories.size;
    });

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Angular Blog - Zyra UI guides, tokens, and components',
            description:
                'Read Angular tutorials, design-token guidance, component architecture notes, and public website SEO tips from Zyra UI.',
            url: 'https://www.zyraui.dev/blog',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));

        this.blogService.getAllPosts().subscribe({
            next: (posts) => {
                this.posts.set(
                    [...posts].sort(
                        (left, right) =>
                            new Date(right.date.trim()).getTime() -
                            new Date(left.date.trim()).getTime(),
                    ),
                );
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Unable to load articles right now. Please try again in a moment.');
                this.loading.set(false);
            },
        });
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }

    categoryLabel(category: PostMeta['category']): string {
        if (Array.isArray(category)) {
            return category[0]?.trim() || 'Angular';
        }

        return category?.trim() || 'Angular';
    }
}

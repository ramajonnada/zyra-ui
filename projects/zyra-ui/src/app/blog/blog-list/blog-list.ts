import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { BlogService, PostMeta } from '../../services/blog-service';
import { CommonModule } from '@angular/common';
import { ZyraCard } from 'zyra-ng-ui';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../seo/seo.service';

@Component({
	selector: 'app-blog-list',
	imports: [ZyraCard, CommonModule, RouterLink],
	templateUrl: './blog-list.html',
	styleUrl: './blog-list.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogList implements OnInit {
	loading = signal(true);
	error = signal<string | null>(null);
	posts = signal<PostMeta[]>([]);
	readonly articleCount = computed(() => this.posts().length);
	readonly categoryCount = computed(() => {
		const categories = new Set(
			this.posts()
				.map((post) => this.categoryLabel(post.category))
				.filter(Boolean),
		);

		return categories.size;
	});

	private blogService: BlogService = inject(BlogService);

	private seo = inject(SeoService);

	ngOnInit() {
		this.seo.setSEO({
			title: 'Angular Blog – Zyra UI',
			description: 'Read Angular tutorials, performance tips, and modern development guides.',
			url: 'https://www.zyraui.dev/blog'
		});
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

	categoryLabel(category: PostMeta['category']): string {
		if (Array.isArray(category)) {
			return category[0]?.trim() || 'Angular';
		}

		return category?.trim() || 'Angular';
	}


}

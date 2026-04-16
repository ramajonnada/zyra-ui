import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { BlogService, PostMeta } from '../../services/blog-service';
import { CommonModule } from '@angular/common';
import { ZyraCard } from 'zyra-ng-ui';
import { Router } from '@angular/router';

@Component({
	selector: 'app-blog-list',
	imports: [ZyraCard, CommonModule],
	templateUrl: './blog-list.html',
	styleUrl: './blog-list.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogList implements OnInit {
	loading = signal(true);
	error = signal<string | null>(null);
	posts = signal<PostMeta[]>([]);

	private blogService: BlogService = inject(BlogService);
	private router = inject(Router);

	ngOnInit() {
		this.blogService.getAllPosts().subscribe({
			next: (posts) => {
				this.posts.set(
					[...posts].sort(
						(left, right) => new Date(right.date.trim()).getTime() - new Date(left.date.trim()).getTime()
					)
				);
				this.loading.set(false);
			},
			error: () => {
				this.error.set('Unable to load articles right now. Please try again in a moment.');
				this.loading.set(false);
			},
		});
	}

	openPost(slug: string): void {
		void this.router.navigate(['/blog', slug]);
	}

	categoryLabel(category: PostMeta['category']): string {
		if (Array.isArray(category)) {
			return category[0]?.trim() || 'Angular';
		}

		return category?.trim() || 'Angular';
	}
}

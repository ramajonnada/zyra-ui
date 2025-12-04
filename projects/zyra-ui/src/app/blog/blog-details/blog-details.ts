import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Title, Meta } from '@angular/platform-browser';
import { BlogService } from '../../services/blog-service';

@Component({
	selector: 'app-blog-page',
	standalone: true,
	imports: [CommonModule, MarkdownModule],
	templateUrl: './blog-details.html',
	styleUrls: ['./blog-details.scss'],
})
export class BlogDetails implements OnInit {
	markdownContent = '';

	private route: ActivatedRoute = inject(ActivatedRoute);
	private blogService: BlogService = inject(BlogService);
	private title: Title = inject(Title);
	private meta: Meta = inject(Meta);
	private cd: ChangeDetectorRef = inject(ChangeDetectorRef);

	ngOnInit() {
		const slug = this.route.snapshot.paramMap.get('slug')!;
		this.blogService.getPostContent(slug).subscribe((md) => {
			this.markdownContent = md;
			this.cd.detectChanges();

			// Extract title from frontmatter or use slug as fallback
			const match = md.match(/title:\s*(.*)/);
			const pageTitle = match ? match[1].trim() : slug;
			this.title.setTitle(pageTitle);
			this.meta.updateTag({ name: 'description', content: `Read blog post: ${pageTitle}` });
		});
	}
}

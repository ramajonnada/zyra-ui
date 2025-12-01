import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Title, Meta } from '@angular/platform-browser';
import { BlogService } from '../../services/blog-service';

@Component({
  selector: 'blog-detail',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './blog-page.html',
  styleUrls: ['./blog-page.scss'],
})
export class BlogPage {
  markdownContent = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private title: Title,
    private meta: Meta,
    private cd: ChangeDetectorRef,
  ) {}

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

import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Title, Meta } from '@angular/platform-browser';
import { BlogService } from '../../services/blog-service';

@Component({
    selector: 'app-blog-details',
    standalone: true,
    imports: [CommonModule, MarkdownModule],
    templateUrl: './blog-details.html',
    styleUrls: ['./blog-details.scss'],
})
export class BlogDetails implements OnInit {
    markdownContent = '';

    private route = inject(ActivatedRoute);
    private blogService = inject(BlogService);
    private title = inject(Title);
    private meta = inject(Meta);
    private cd = inject(ChangeDetectorRef);

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug')!;

        this.blogService.getPostContent(slug).subscribe((md) => {
            // ✅ 1. Strip front-matter BEFORE rendering
            this.markdownContent = this.stripFrontMatter(md);

            // ✅ 2. Extract metadata cleanly
            const titleMatch = md.match(/^title:\s*(.*)$/m);
            const descMatch = md.match(/^description:\s*(.*)$/m);

            const pageTitle = titleMatch ? titleMatch[1].trim() : slug;
            const description = descMatch ? descMatch[1].trim() : `Read blog post: ${pageTitle}`;

            // ✅ 3. SEO
            this.title.setTitle(pageTitle);
            this.meta.updateTag({ name: 'description', content: description });

            this.cd.detectChanges();
        });
    }

    // ✅ Utility stays the same
    stripFrontMatter(md: string): string {
        return md.replace(/^---[\s\S]*?---/, '').trim();
    }
}

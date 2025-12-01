import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService, PostMeta } from '../../services/blog-service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog-list',
    imports: [RouterLink, CommonModule],
    templateUrl: './blog-list.html',
    styleUrl: './blog-list.scss',
})
export class BlogList implements OnInit {
    posts: PostMeta[] = [];
    private blogService: BlogService = inject(BlogService);
    private cd: ChangeDetectorRef = inject(ChangeDetectorRef);

    ngOnInit() {
        this.blogService.getAllPosts().subscribe((posts) => {
            this.posts = posts;
            this.cd.detectChanges();
            console.log('Loaded blog posts:', this.posts);
        });
    }
}

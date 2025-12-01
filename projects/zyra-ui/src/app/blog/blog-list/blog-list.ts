import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService, PostMeta } from '../../services/blog-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  posts: PostMeta[] = [];

  constructor(
    private blogService: BlogService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.blogService.getAllPosts().subscribe((posts) => {
      this.posts = posts;
      this.cd.detectChanges();
      console.log('Loaded blog posts:', this.posts);
    });
  }
}

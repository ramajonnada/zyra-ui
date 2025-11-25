import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost, BlogService } from '../../services/blog-service';

@Component({
	selector: 'app-blog-list',
	imports: [RouterLink],
	templateUrl: './blog-list.html',
	styleUrl: './blog-list.scss',
})
export class BlogList {
	// private blogService = inject(BlogService);
	posts: BlogPost[]

	constructor(private blogService: BlogService) {
		this.posts = this.blogService.getAllPosts();
	}

}

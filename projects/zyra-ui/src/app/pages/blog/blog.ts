import { Component } from '@angular/core';
import { BlogList } from "../../blog/blog-list/blog-list";

@Component({
	selector: 'app-blog',
	imports: [BlogList],
	templateUrl: './blog.html',
	styleUrl: './blog.scss',
})
export class Blog {

}

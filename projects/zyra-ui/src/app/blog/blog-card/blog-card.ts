import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostMeta } from '../../services/blog-service';
import { DatePipe } from '@angular/common';





@Component({
	selector: 'app-blog-card',
	imports: [RouterLink, DatePipe],
	templateUrl: './blog-card.html',
	styleUrl: './blog-card.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogCard {
	@Input({ required: true }) blog!: PostMeta;
}

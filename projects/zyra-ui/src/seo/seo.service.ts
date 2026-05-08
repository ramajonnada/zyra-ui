import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root',
})
export class SeoService {
	private title = inject(Title);
	private meta = inject(Meta);

	setSEO(config: {
		title: string;
		description: string;
		url: string;
		image?: string;
	}) {
		const {
			title,
			description,
			url,
			image = 'https://www.zyraui.dev/final-icon.png',
		} = config;

		this.title.setTitle(title);

		this.meta.updateTag({ name: 'description', content: description });
		this.meta.updateTag({ property: 'og:title', content: title });
		this.meta.updateTag({ property: 'og:description', content: description });
		this.meta.updateTag({ property: 'og:url', content: url });
		this.meta.updateTag({ property: 'og:image', content: image });
	}
}

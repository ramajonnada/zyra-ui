import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
	title: string;
	description: string;
	url?: string;
	image?: string;
}

@Injectable({
	providedIn: 'root'
})
export class SeoService {
	private title = inject(Title);
	private meta = inject(Meta);

	setSEO(config: SeoConfig) {
		const {
			title,
			description,
			url = 'https://www.zyraui.dev/',
			image = 'https://www.zyraui.dev/final-icon.png'
		} = config;

		// ✅ Title
		this.title.setTitle(title);

		// ✅ Basic Meta
		this.meta.updateTag({ name: 'description', content: description });

		// ✅ Open Graph
		this.meta.updateTag({ property: 'og:title', content: title });
		this.meta.updateTag({ property: 'og:description', content: description });
		this.meta.updateTag({ property: 'og:url', content: url });
		this.meta.updateTag({ property: 'og:image', content: image });
		this.meta.updateTag({ property: 'og:type', content: 'website' });

		// ✅ Twitter
		this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
		this.meta.updateTag({ name: 'twitter:title', content: title });
		this.meta.updateTag({ name: 'twitter:description', content: description });
		this.meta.updateTag({ name: 'twitter:image', content: image });

		// ✅ Canonical
		this.setCanonical(url);
	}

	private setCanonical(url: string) {
		let link: HTMLLinkElement | null =
			document.querySelector("link[rel='canonical']");

		if (!link) {
			link = document.createElement('link');
			link.setAttribute('rel', 'canonical');
			document.head.appendChild(link);
		}

		link.setAttribute('href', url);
	}
}
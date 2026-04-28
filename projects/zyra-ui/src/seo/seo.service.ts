import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})
export class SeoService {
	private title = inject(Title);
	private meta = inject(Meta);
	private platformId = inject(PLATFORM_ID);

	setSEO(config: any) {
		const {
			title,
			description,
			url,
			image = 'https://www.zyraui.dev/final-icon.png'
		} = config;

		this.title.setTitle(title);

		this.meta.updateTag({ name: 'description', content: description });

		this.meta.updateTag({ property: 'og:title', content: title });
		this.meta.updateTag({ property: 'og:description', content: description });
		this.meta.updateTag({ property: 'og:url', content: url });
		this.meta.updateTag({ property: 'og:image', content: image });

		// ✅ FIX: Only run in browser
		if (isPlatformBrowser(this.platformId)) {
			this.setCanonical(url);
		}
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
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    tags?: string[];
    noindex?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class SeoService {
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);
    private readonly document = inject(DOCUMENT);

    setSEO(config: SeoConfig): void {
        const {
            title,
            description,
            url,
            image = 'https://www.zyraui.dev/og-preview.png',
            type = 'website',
            publishedTime,
            tags,
            noindex = false,
        } = config;

        this.title.setTitle(title);
        this.meta.updateTag({ name: 'description', content: description });

        if (noindex) {
            this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
        } else {
            this.meta.removeTag('name="robots"');
        }

        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:site_name', content: 'Zyra UI' });
        this.meta.updateTag({ property: 'og:type', content: type });
        this.meta.updateTag({ property: 'og:locale', content: 'en_US' });

        if (type === 'article') {
            if (publishedTime) {
                this.meta.updateTag({ property: 'article:published_time', content: publishedTime });
            }
            this.meta.updateTag({ property: 'article:author', content: 'Rama Jonnada' });
            if (tags?.length) {
                this.meta
                    .getTags('property="article:tag"')
                    .forEach((el) => this.meta.removeTagElement(el));
                tags.forEach((tag) => this.meta.addTag({ property: 'article:tag', content: tag }));
            }
        } else {
            this.meta.removeTag('property="article:published_time"');
            this.meta.removeTag('property="article:author"');
            this.meta
                .getTags('property="article:tag"')
                .forEach((el) => this.meta.removeTagElement(el));
        }

        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image });

        this.setCanonical(url);
    }

    injectJsonLd(id: string, schema: object): void {
        const existing = this.document.getElementById(id);
        if (existing) existing.remove();

        const script = this.document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        this.document.head.appendChild(script);
    }

    removeJsonLd(id: string): void {
        this.document.getElementById(id)?.remove();
    }

    private setCanonical(url: string): void {
        let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }

        link.setAttribute('href', url);
    }
}

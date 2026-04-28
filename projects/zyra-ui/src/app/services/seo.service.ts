import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, PRIMARY_OUTLET } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
    robots?: string;
    keywords?: string[];
    canonicalPath?: string;
}

export type RouteSeoData = SeoConfig;

@Injectable({ providedIn: 'root' })
export class SeoService {
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);
    private readonly document = inject(DOCUMENT);

    private readonly siteName = 'Zyra UI';
    private readonly baseUrl = 'https://www.zyraui.dev';
    private readonly defaultTitle = 'Zyra UI - Modern Angular UI Library';
    private readonly defaultDescription =
        'Zyra UI is a modern Angular UI library with reusable components, utilities, and performance-focused design.';
    private readonly defaultImage = `${this.baseUrl}/og-image.png`;
    private readonly defaultRobots = 'index,follow';

    applyRouteSeo(snapshot: ActivatedRouteSnapshot, currentUrl: string): void {
        const routeSeo = this.findRouteSeo(snapshot);

        this.apply({
            ...routeSeo,
            canonicalPath: routeSeo?.canonicalPath ?? currentUrl,
        });
    }

    apply(config: SeoConfig): void {
        const title = config.title?.trim() || this.defaultTitle;
        const description = config.description?.trim() || this.defaultDescription;
        const image = this.toAbsoluteUrl(config.image) || this.defaultImage;
        const canonicalUrl = this.buildCanonicalUrl(config.canonicalPath);
        const robots = config.robots?.trim() || this.defaultRobots;
        const type = config.type || 'website';
        const keywords = this.normalizeKeywords(config.keywords);

        this.title.setTitle(title);
        this.updateTag('name', 'description', description);
        this.updateTag('name', 'robots', robots);
        this.updateTag('property', 'og:title', title);
        this.updateTag('property', 'og:description', description);
        this.updateTag('property', 'og:type', type);
        this.updateTag('property', 'og:url', canonicalUrl);
        this.updateTag('property', 'og:image', image);
        this.updateTag('property', 'og:site_name', this.siteName);
        this.updateTag('name', 'twitter:card', 'summary_large_image');
        this.updateTag('name', 'twitter:title', title);
        this.updateTag('name', 'twitter:description', description);
        this.updateTag('name', 'twitter:image', image);

        if (keywords) {
            this.updateTag('name', 'keywords', keywords);
        } else {
            this.meta.removeTag("name='keywords'");
        }

        this.updateCanonicalLink(canonicalUrl);
    }

    private findRouteSeo(snapshot: ActivatedRouteSnapshot): RouteSeoData | undefined {
        let current: ActivatedRouteSnapshot | null = snapshot;
        let lastSeo: RouteSeoData | undefined;

        while (current) {
            const routeSeo = current.data?.['seo'] as RouteSeoData | undefined;
            if (routeSeo) {
                lastSeo = routeSeo;
            }

            current =
                current.children.find((child) => child.outlet === PRIMARY_OUTLET) ??
                current.firstChild ??
                null;
        }

        return lastSeo;
    }

    private updateTag(attribute: 'name' | 'property', key: string, content: string): void {
        this.meta.updateTag({ [attribute]: key, content }, `${attribute}='${key}'`);
    }

    private updateCanonicalLink(url: string): void {
        let canonicalLink = this.document.head.querySelector(
            'link[rel="canonical"]',
        ) as HTMLLinkElement | null;

        if (!canonicalLink) {
            canonicalLink = this.document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            this.document.head.appendChild(canonicalLink);
        }

        canonicalLink.setAttribute('href', url);
    }

    private buildCanonicalUrl(pathOrUrl?: string): string {
        if (!pathOrUrl) {
            return `${this.baseUrl}/`;
        }

        if (/^https?:\/\//i.test(pathOrUrl)) {
            return pathOrUrl;
        }

        const path = (pathOrUrl.split(/[?#]/, 1)[0] || '/').trim();
        if (path === '' || path === '/') {
            return `${this.baseUrl}/`;
        }

        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${this.baseUrl}${normalizedPath.endsWith('/') ? normalizedPath.slice(0, -1) : normalizedPath}`;
    }

    private toAbsoluteUrl(url?: string): string | undefined {
        if (!url?.trim()) {
            return undefined;
        }

        if (/^https?:\/\//i.test(url)) {
            return url;
        }

        return `${this.baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    }

    private normalizeKeywords(keywords?: string[]): string | undefined {
        if (!keywords?.length) {
            return undefined;
        }

        const uniqueKeywords = [...new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean))];
        return uniqueKeywords.length ? uniqueKeywords.join(', ') : undefined;
    }
}

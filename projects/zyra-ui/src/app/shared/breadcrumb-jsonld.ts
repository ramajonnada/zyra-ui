export interface BreadcrumbLink {
    label: string;
    url: string;
}

const SITE_ORIGIN = 'https://www.zyraui.dev';

/**
 * Breadcrumb `url`s are absolute (needed for JSON-LD structured data), but binding them
 * directly to an anchor's href forces a full page reload instead of client-side routing.
 * This derives the internal path so breadcrumb links can navigate via routerLink instead.
 */
export function internalPath(url: string): string {
    return url.startsWith(SITE_ORIGIN) ? url.slice(SITE_ORIGIN.length) || '/' : url;
}

export function breadcrumbJsonLd(items: readonly BreadcrumbLink[]): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.url,
        })),
    };
}

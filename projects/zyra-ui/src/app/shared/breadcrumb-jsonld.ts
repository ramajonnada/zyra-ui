export interface BreadcrumbLink {
    label: string;
    url: string;
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

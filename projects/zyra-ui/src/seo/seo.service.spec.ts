import { TestBed } from '@angular/core/testing';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
    let service: SeoService;
    let title: Title;
    let meta: Meta;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
        });
        service = TestBed.inject(SeoService);
        title = TestBed.inject(Title);
        meta = TestBed.inject(Meta);
    });

    afterEach(() => {
        // Clean up canonical link between tests
        document.querySelectorAll("link[rel='canonical']").forEach((el) => el.remove());
    });

    // ── setSEO — title and description ───────────────────────────────────────
    it('sets the document title', () => {
        service.setSEO({ title: 'Test Page', description: 'Desc', url: 'https://example.com' });
        expect(title.getTitle()).toBe('Test Page');
    });

    it('sets the meta description', () => {
        service.setSEO({ title: 'T', description: 'My description', url: 'https://example.com' });
        expect(meta.getTag('name="description"')?.content).toBe('My description');
    });

    // ── setSEO — Open Graph ──────────────────────────────────────────────────
    it('sets og:title', () => {
        service.setSEO({ title: 'OG Title', description: 'D', url: 'https://example.com' });
        expect(meta.getTag('property="og:title"')?.content).toBe('OG Title');
    });

    it('sets og:description', () => {
        service.setSEO({ title: 'T', description: 'OG Desc', url: 'https://example.com' });
        expect(meta.getTag('property="og:description"')?.content).toBe('OG Desc');
    });

    it('sets og:url', () => {
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com/page' });
        expect(meta.getTag('property="og:url"')?.content).toBe('https://example.com/page');
    });

    it('uses the default og:image when no image is provided', () => {
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com' });
        expect(meta.getTag('property="og:image"')?.content).toBe(
            'https://www.zyraui.dev/og-preview.png',
        );
    });

    it('uses a custom og:image when provided', () => {
        service.setSEO({
            title: 'T',
            description: 'D',
            url: 'https://example.com',
            image: 'https://example.com/custom.png',
        });
        expect(meta.getTag('property="og:image"')?.content).toBe('https://example.com/custom.png');
    });

    it('sets og:site_name to Zyra UI', () => {
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com' });
        expect(meta.getTag('property="og:site_name"')?.content).toBe('Zyra UI');
    });

    // ── setSEO — noindex ─────────────────────────────────────────────────────
    it('adds noindex robots meta when noindex is true', () => {
        service.setSEO({
            title: 'T',
            description: 'D',
            url: 'https://example.com',
            noindex: true,
        });
        expect(meta.getTag('name="robots"')?.content).toBe('noindex, follow');
    });

    it('removes robots meta when noindex is false', () => {
        service.setSEO({
            title: 'T',
            description: 'D',
            url: 'https://example.com',
            noindex: true,
        });
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com' });
        expect(meta.getTag('name="robots"')).toBeNull();
    });

    // ── setSEO — Twitter cards ───────────────────────────────────────────────
    it('sets twitter:card to summary_large_image', () => {
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com' });
        expect(meta.getTag('name="twitter:card"')?.content).toBe('summary_large_image');
    });

    it('sets twitter:title and twitter:description', () => {
        service.setSEO({ title: 'TW Title', description: 'TW Desc', url: 'https://example.com' });
        expect(meta.getTag('name="twitter:title"')?.content).toBe('TW Title');
        expect(meta.getTag('name="twitter:description"')?.content).toBe('TW Desc');
    });

    // ── setSEO — canonical ───────────────────────────────────────────────────
    it('creates a canonical link tag with the given URL', () => {
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com/canonical' });
        const link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
        expect(link).not.toBeNull();
        expect(link.getAttribute('href')).toBe('https://example.com/canonical');
    });

    it('updates the canonical href on subsequent calls', () => {
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com/first' });
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com/second' });
        const links = document.querySelectorAll("link[rel='canonical']");
        expect(links.length).toBe(1);
        expect((links[0] as HTMLLinkElement).getAttribute('href')).toBe(
            'https://example.com/second',
        );
    });

    // ── setSEO — article type ────────────────────────────────────────────────
    it('sets article:author when type is article', () => {
        service.setSEO({
            title: 'T',
            description: 'D',
            url: 'https://example.com',
            type: 'article',
        });
        expect(meta.getTag('property="article:author"')?.content).toBe('Rama Jonnada');
    });

    it('sets article:published_time when type is article and publishedTime provided', () => {
        service.setSEO({
            title: 'T',
            description: 'D',
            url: 'https://example.com',
            type: 'article',
            publishedTime: '2026-01-01T00:00:00Z',
        });
        expect(meta.getTag('property="article:published_time"')?.content).toBe(
            '2026-01-01T00:00:00Z',
        );
    });

    it('removes article tags when type switches to website', () => {
        service.setSEO({
            title: 'T',
            description: 'D',
            url: 'https://example.com',
            type: 'article',
        });
        service.setSEO({ title: 'T', description: 'D', url: 'https://example.com' });
        expect(meta.getTag('property="article:author"')).toBeNull();
    });

    // ── injectJsonLd ─────────────────────────────────────────────────────────
    it('creates a JSON-LD script element in the head', () => {
        service.injectJsonLd('test-schema', { '@type': 'WebSite', name: 'Test' });
        const el = document.getElementById('test-schema');
        expect(el).not.toBeNull();
        expect(el?.tagName).toBe('SCRIPT');
        expect(el?.getAttribute('type')).toBe('application/ld+json');
        el?.remove();
    });

    it('replaces an existing JSON-LD element with the same id', () => {
        service.injectJsonLd('dup-schema', { name: 'First' });
        service.injectJsonLd('dup-schema', { name: 'Second' });
        const elements = document.querySelectorAll('#dup-schema');
        expect(elements.length).toBe(1);
        expect(JSON.parse(elements[0].textContent ?? '').name).toBe('Second');
        elements[0].remove();
    });

    it('serialises the schema as JSON in the script textContent', () => {
        const schema = { '@context': 'https://schema.org', '@type': 'SoftwareApplication' };
        service.injectJsonLd('json-schema', schema);
        const el = document.getElementById('json-schema');
        expect(JSON.parse(el?.textContent ?? '')).toEqual(schema);
        el?.remove();
    });

    // ── removeJsonLd ─────────────────────────────────────────────────────────
    it('removes an existing JSON-LD script by id', () => {
        service.injectJsonLd('remove-schema', { name: 'ToRemove' });
        service.removeJsonLd('remove-schema');
        expect(document.getElementById('remove-schema')).toBeNull();
    });

    it('does not throw when removing a non-existent id', () => {
        expect(() => service.removeJsonLd('no-such-id')).not.toThrow();
    });
});

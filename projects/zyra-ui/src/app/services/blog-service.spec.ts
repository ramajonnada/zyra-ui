import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { BlogService, BLOG_CONTENT_LOADER, BLOG_POSTS_LOADER, PostMeta } from './blog-service';

const MOCK_POSTS: PostMeta[] = [
    {
        slug: 'test-post',
        title: 'Test Post',
        date: '2026-01-01',
        description: 'A test post',
        readTime: '2 min',
        category: 'Angular',
    },
];

describe('BlogService — HTTP path (no loader)', () => {
    let service: BlogService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(BlogService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('getAllPosts() sends GET /content/index.json', () => {
        service.getAllPosts().subscribe();
        const req = httpMock.expectOne('/content/index.json');
        expect(req.request.method).toBe('GET');
        req.flush(MOCK_POSTS);
    });

    it('getAllPosts() returns the parsed posts array', () => {
        let result: PostMeta[] | undefined;
        service.getAllPosts().subscribe((posts) => (result = posts));
        httpMock.expectOne('/content/index.json').flush(MOCK_POSTS);
        expect(result).toEqual(MOCK_POSTS);
    });

    it('getPostContent() sends GET /content/{slug}.md', () => {
        service.getPostContent('test-post').subscribe();
        const req = httpMock.expectOne('/content/test-post.md');
        expect(req.request.method).toBe('GET');
        req.flush('# Test Post');
    });

    it('getPostContent() returns the raw markdown string', () => {
        let content: string | undefined;
        service.getPostContent('my-slug').subscribe((c) => (content = c));
        httpMock.expectOne('/content/my-slug.md').flush('## Hello');
        expect(content).toBe('## Hello');
    });
});

describe('BlogService — loader path (BLOG_POSTS_LOADER provided)', () => {
    let service: BlogService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: BLOG_POSTS_LOADER,
                    useValue: () => Promise.resolve(MOCK_POSTS),
                },
                {
                    provide: BLOG_CONTENT_LOADER,
                    useValue: (_slug: string) => Promise.resolve('# Loaded Content'),
                },
            ],
        });
        service = TestBed.inject(BlogService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('getAllPosts() uses the injected loader instead of HTTP', (done) => {
        service.getAllPosts().subscribe((posts) => {
            expect(posts).toEqual(MOCK_POSTS);
            httpMock.expectNone('/content/index.json');
            done();
        });
    });

    it('getPostContent() uses the injected loader instead of HTTP', (done) => {
        service.getPostContent('any-slug').subscribe((content) => {
            expect(content).toBe('# Loaded Content');
            httpMock.expectNone('/content/any-slug.md');
            done();
        });
    });
});

describe('BlogService — loader error handling', () => {
    let service: BlogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: BLOG_POSTS_LOADER,
                    useValue: () => Promise.reject(new Error('load failed')),
                },
                {
                    provide: BLOG_CONTENT_LOADER,
                    useValue: () => Promise.reject(new Error('content failed')),
                },
            ],
        });
        service = TestBed.inject(BlogService);
    });

    it('getAllPosts() returns an empty array when loader rejects', (done) => {
        service.getAllPosts().subscribe((posts) => {
            expect(posts).toEqual([]);
            done();
        });
    });

    it('getPostContent() returns an empty string when loader rejects', (done) => {
        service.getPostContent('bad-slug').subscribe((content) => {
            expect(content).toBe('');
            done();
        });
    });
});

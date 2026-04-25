import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { BlogService } from './blog-service';

describe('BlogService', () => {
    let service: BlogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient()],
        });
        service = TestBed.inject(BlogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

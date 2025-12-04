import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetails } from './blog-details';

describe('BlogDetails', () => {
	let component: BlogDetails;
	let fixture: ComponentFixture<BlogDetails>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BlogDetails],
		}).compileComponents();

		fixture = TestBed.createComponent(BlogDetails);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCard } from './blog-card';

describe('BlogCard', () => {
  let component: BlogCard;
  let fixture: ComponentFixture<BlogCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

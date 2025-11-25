import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogList } from './blog-list';

describe('BlogList', () => {
  let component: BlogList;
  let fixture: ComponentFixture<BlogList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

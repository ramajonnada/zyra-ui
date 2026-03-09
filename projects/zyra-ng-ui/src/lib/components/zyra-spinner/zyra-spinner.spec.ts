import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraSpinner } from './zyra-spinner';

describe('ZyraSpinner', () => {
  let component: ZyraSpinner;
  let fixture: ComponentFixture<ZyraSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZyraSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZyraSpinner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraFormField } from './zyra-form-field';

describe('ZyraFormField', () => {
  let component: ZyraFormField;
  let fixture: ComponentFixture<ZyraFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZyraFormField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZyraFormField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

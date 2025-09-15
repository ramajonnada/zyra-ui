import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraUi } from './zyra-ui';

describe('ZyraUi', () => {
  let component: ZyraUi;
  let fixture: ComponentFixture<ZyraUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZyraUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZyraUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

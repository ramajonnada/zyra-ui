import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraUiLib } from './zyra-ui-lib';

describe('ZyraUiLib', () => {
  let component: ZyraUiLib;
  let fixture: ComponentFixture<ZyraUiLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZyraUiLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZyraUiLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

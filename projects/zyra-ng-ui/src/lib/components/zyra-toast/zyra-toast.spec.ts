import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraToast } from './zyra-toast';

describe('ZyraToast', () => {
  let component: ZyraToast;
  let fixture: ComponentFixture<ZyraToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZyraToast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZyraToast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

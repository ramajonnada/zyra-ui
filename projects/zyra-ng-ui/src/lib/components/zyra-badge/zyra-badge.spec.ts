import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraBadge } from './zyra-badge';

describe('ZyraBadge', () => {
  let component: ZyraBadge;
  let fixture: ComponentFixture<ZyraBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZyraBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZyraBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

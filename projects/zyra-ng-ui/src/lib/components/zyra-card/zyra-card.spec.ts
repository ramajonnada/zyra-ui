import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraCard } from './zyra-card';

describe('ZyraCard', () => {
  let component: ZyraCard;
  let fixture: ComponentFixture<ZyraCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZyraCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZyraCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZyraButton } from './zyra-button';

describe('Button', () => {
	let component: ZyraButton;
	let fixture: ComponentFixture<ZyraButton>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ZyraButton]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ZyraButton);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

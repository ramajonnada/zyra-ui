import { Component, Input } from '@angular/core';

@Component({
	selector: 'zyra-button',
	imports: [],
	standalone: true,
	templateUrl: './button.html',
	styleUrl: './button.css',
})
export class ZyraButton {
	@Input() variant: 'gradient' | 'primary' | 'secondary' | 'accent' | 'success' | 'danger' = 'primary';
	@Input() size: 'sm' | 'md' | 'lg' = 'md';
	@Input() disabled = false;
	@Input() type: 'button' | 'submit' | 'reset' = 'button';

	ngOnChanges() {
		console.log(this.variant);
	}
}

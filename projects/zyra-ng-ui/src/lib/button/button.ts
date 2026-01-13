import { Component, Input } from '@angular/core';

@Component({
	selector: 'zyra-button',
	imports: [],
	standalone: true,
	templateUrl: './button.html',
	styleUrl: './button.css',
})
export class ZyraButton {
	@Input() variant: 'gradient' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' = 'primary';
	@Input() size: 'sm' | 'md' | 'lg' = 'md';
	@Input() disabled = false;
	@Input() type: 'button' | 'submit' | 'reset' = 'button';
	@Input() loading = false;
	@Input() fullWidth = false;

	ngOnChanges() {
	}
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'zy-button',
	imports: [CommonModule],
	standalone: true,
	templateUrl: './button.html',
	styleUrl: './button.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
	@Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
	@Input() disabled = false;
	@Input() type: 'button' | 'submit' | 'reset' = 'button';
}
import { Component, input } from '@angular/core';

@Component({
	selector: 'zyra-form-field',
	imports: [],
	templateUrl: './zyra-form-field.html',
	styleUrl: './zyra-form-field.css',
})
export class ZyraFormField {
	label = input<string>('');

	error = input<string>('');

}

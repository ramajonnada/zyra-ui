import {
	Component,
	computed,
	input,
	signal,
	Optional,
	Self
} from '@angular/core';

import { NgControl } from '@angular/forms';

let nextId = 0;

@Component({
	selector: 'zyra-input',
	templateUrl: './zyra-input.html',
	styleUrls: ['./zyra-input.css'],
	host: {
		'[class.zyra-input-disabled]': 'disabled()',
		'[class.zyra-input-focused]': 'focused()',
		'[class.zyra-input-invalid]': 'errorState()'
	}
})
export class ZyraInput {

	/* =====================
	 * Public API (signals)
	 * ===================== */

	type = input<'text' | 'email' | 'password' | 'number'>('text');

	placeholder = input('');

	id = input<string | null>(null);

	required = input(false);


	/* =====================
	 * Internal state
	 * ===================== */

	value = signal('');

	focused = signal(false);

	disabled = signal(false);


	/** auto generate id */
	inputId = computed(() =>
		this.id() ?? `zyra-input-${nextId++}`
	);


	/** empty state */
	empty = computed(() =>
		!this.value()
	);


	/** error state (Angular Forms) */
	errorState = computed(() =>
		!!this.ngControl?.invalid &&
		!!this.ngControl?.touched
	);


	constructor(
		@Optional()
		@Self()
		public ngControl: NgControl
	) {

		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}

	}


	/* =====================
	 * ControlValueAccessor
	 * ===================== */

	private onChange = (_: string) => { };

	private onTouched = () => { };


	writeValue(value: string | null): void {

		this.value.set(value ?? '');

	}


	registerOnChange(fn: (value: string) => void): void {

		this.onChange = fn;

	}


	registerOnTouched(fn: () => void): void {

		this.onTouched = fn;

	}


	setDisabledState(isDisabled: boolean): void {

		this.disabled.set(isDisabled);

	}



	/* =====================
	 * DOM events
	 * ===================== */

	handleInput(event: Event) {

		const newValue =
			(event.target as HTMLInputElement).value;

		this.value.set(newValue);

		this.onChange(newValue);

	}


	handleFocus() {

		this.focused.set(true);

	}


	handleBlur() {

		this.focused.set(false);

		this.onTouched();

	}

}
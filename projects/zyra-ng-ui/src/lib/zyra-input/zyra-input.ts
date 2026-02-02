import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject, DestroyRef, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ZyraInputType } from './_/input-type';


@Component({
	selector: 'zyra-input',
	standalone: true,
	imports: [CommonModule, FormsModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ZyraInput),
			multi: true
		}
	],
	templateUrl: './zyra-input.html',
	styleUrls: ['./zyra-input.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZyraInput implements ControlValueAccessor, OnInit {
	// Signal inputs (Angular 17.1+)
	label = input<string | undefined>();
	placeholder = input<string>("Enter");
	type = input<ZyraInputType>('text');
	disabled = input<boolean>(false);
	required = input<boolean>(false);
	error = input<string | undefined>();
	hint = input<string | undefined>();
	success = input<string | undefined>();
	icon = input<string | undefined>();// icon class or svg id

	// Internal state signals
	private valueSignal = signal<string>('');
	value = this.valueSignal.asReadonly();
	focused = signal<boolean>(false);

	inputId = signal<string>(`zyra-input-${crypto.randomUUID().slice(0, 8)}`);
	successId = computed(() => this.inputId() + '-success');
	hintId = computed(() => this.inputId() + '-hint');
	errorId = computed(() => this.inputId() + '-error');
	describedby = computed(() => {
		return this.error() ? this.errorId() :
			this.success() ? this.successId() :
				this.hint() ? this.hintId() : null
	});
	// CVA callbacks
	private onChange = (value: string) => { };
	private onTouched = () => { };

	private destroyRef = inject(DestroyRef);

	ngOnInit() {
		this.valueSignal.set("");
		// debugger;
		// No initial effect needed; signals handle reactivity
	}

	writeValue(value: string): void {
		this.valueSignal.set(value ?? '');
	}

	registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		// this.disabled.set(isDisabled);
		// Signal update triggers OnPush via signals
	}

	onInput(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.valueSignal.set(target.value);
		this.onChange(target.value);
	}

	onBlur(): void {
		this.focused.set(false);
		this.onTouched();
	}

	onFocus(): void {
		this.focused.set(true);
	}
}

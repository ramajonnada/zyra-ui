import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	input,
	model,
	output,
	signal,
	ViewChild,
	ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'success' | 'error';

@Component({
	selector: 'zyra-input',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule],
	templateUrl: './zyra-input.html',
	styleUrl: './zyra-input.scss',
})
export class ZyraInput {
	// ── Inputs ────────────────────────────────────────────────
	value = model<string>('');
	type = input<InputType>('text');
	size = input<InputSize>('md');
	status = input<InputStatus>('default');
	label = input<string>('');
	placeholder = input<string>('');
	hint = input<string>('');
	error = input<string>('');
	prefixIcon = input<string>('');
	suffixIcon = input<string>('');
	disabled = input<boolean>(false);
	readonly = input<boolean>(false);
	required = input<boolean>(false);
	id = input<string>('');

	// ── Outputs ───────────────────────────────────────────────
	valueChange = output<string>();
	blurred = output<FocusEvent>();

	// ── Internal state ────────────────────────────────────────
	focused = signal(false);
	showPassword = signal(false);

	// ── Computed ──────────────────────────────────────────────
	inputId = computed(() => this.id() || `zyr-input-${Math.random().toString(36).slice(2, 7)}`);

	wrapClass = computed(() =>
		`zyr-input zyr-input--${this.size()}`
	);

	fieldClass = computed(() => {
		const classes = [
			'zyr-input__field',
			`zyr-input__field--${this.size()}`,
		];
		if (this.focused()) classes.push('zyr-input__field--focused');
		if (this.status() !== 'default') classes.push(`zyr-input__field--${this.status()}`);
		if (this.prefixIcon()) classes.push('zyr-input__field--has-prefix');
		if (this.suffixIcon() || this.type() === 'password') classes.push('zyr-input__field--has-suffix');
		return classes.join(' ');
	});
}
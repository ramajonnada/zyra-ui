// projects/zyra-ui/src/app/pages/test/input/input.ts

import { Component, inject, signal, computed } from '@angular/core';
import {
	ReactiveFormsModule,
	FormsModule,
	FormGroup,
	FormControl,
	Validators,
	AbstractControl,
	ValidationErrors,
} from '@angular/forms';
import {
	ZyraInput,
	ZyraFormField,
	ZyraButton,
	ZyraBadge,
	ZyraCard,
	ZyraAvatar,
	ZyraTooltip,
	ZyraToastService,
	ZyraToastContainer,
	InputType,
	FormFieldAppearance,
	FormFieldSize,
	ZyraThemeService,
} from 'zyra-ng-ui';

function noSpaces(ctrl: AbstractControl): ValidationErrors | null {
	return ctrl.value?.includes(' ') ? { message: 'Username cannot contain spaces' } : null;
}

function strongPassword(ctrl: AbstractControl): ValidationErrors | null {
	const v = ctrl.value ?? '';
	if (!v) return null;
	const hasUpper = /[A-Z]/.test(v);
	const hasNumber = /[0-9]/.test(v);
	const hasSymbol = /[^A-Za-z0-9]/.test(v);
	if (!hasUpper) return { message: 'Must contain at least one uppercase letter' };
	if (!hasNumber) return { message: 'Must contain at least one number' };
	if (!hasSymbol) return { message: 'Must contain at least one symbol (!@#$...)' };
	return null;
}

@Component({
	selector: 'app-input',
	standalone: true,
	templateUrl: './input.html',
	styleUrl: './input.scss',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ZyraInput,
		ZyraFormField,
		ZyraButton,
		ZyraBadge,
		ZyraCard,
		ZyraAvatar,
		ZyraToastContainer,
	],
})
export class Input {
	themeService = inject(ZyraThemeService);
	toastService = inject(ZyraToastService);

	// ── Playground controls ───────────────────────────────────
	type = signal<InputType>('text');
	size = signal<FormFieldSize>('md');
	appearance = signal<FormFieldAppearance>('outline');
	prefixIcon = signal('');
	suffixIcon = signal('');
	clearButton = signal(false);
	loading = signal(false);
	maxLen = signal<number | null>(null);
	hintText = 'This is a hint message';
	successHint = 'Looks great!';
	labelText = 'Label';

	types: InputType[] = ['text', 'email', 'password', 'number', 'search', 'tel', 'url'];
	sizes: FormFieldSize[] = ['sm', 'md', 'lg'];
	appearances: FormFieldAppearance[] = ['outline', 'filled', 'underline'];
	icons = ['<i class="fa-solid fa-magnifying-glass"></i>', '<i class="fa-solid fa-envelope"></i>', '<i class="fa-solid fa-phone"></i>', '<i class="fa-solid fa-user"></i>', '<i class="fa-solid fa-globe"></i>', '<i class="fa-solid fa-lock"></i>'];

	// ── Playground form control ───────────────────────────────
	playgroundControl = computed(() => {
		const validators = [Validators.required];
		const t = this.type();
		if (t === 'email') validators.push(Validators.email);
		if (t === 'url') validators.push(Validators.pattern(/^https?:\/\/.+/));
		if (this.maxLen()) validators.push(Validators.maxLength(this.maxLen()!));
		return new FormControl('', validators);
	});

	// ── Login form ────────────────────────────────────────────
	loginForm = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required, Validators.minLength(8)]),
	});

	// ── Registration form ─────────────────────────────────────
	registerForm = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(2)]),
		email: new FormControl('', [Validators.required, Validators.email]),
		phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
		password: new FormControl('', [Validators.required, Validators.minLength(8), strongPassword]),
	});

	// ── Profile form ──────────────────────────────────────────
	profileForm = new FormGroup({
		username: new FormControl('zyra_dev', [Validators.required, Validators.minLength(3), noSpaces]),
		website: new FormControl('', [Validators.pattern(/^https?:\/\/.+/)]),
		bio: new FormControl('', [Validators.maxLength(160)]),
	});

	// ── Validators showcase ───────────────────────────────────
	requiredCtrl = new FormControl('', [Validators.required]);
	emailCtrl = new FormControl('', [Validators.required, Validators.email]);
	minLenCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
	maxLenCtrl = new FormControl('', [Validators.maxLength(10)]);
	minCtrl = new FormControl('', [Validators.min(18)]);
	maxCtrl = new FormControl('', [Validators.max(100)]);
	patternCtrl = new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]);
	customCtrl = new FormControl('', [noSpaces]);

	// ── UI state ──────────────────────────────────────────────
	eventLog = signal<{ time: string; event: string; msg: string }[]>([]);
	copied = signal(false);
	loginLoading = signal(false);
	regLoading = signal(false);

	// ── Generated code ────────────────────────────────────────
	generatedCode = computed((): string => {
		const o = '{', c = '}';
		return [
			`<zyra-form-field`,
			`  label="Email"`,
			`  hint="We'll never share it"`,
			`  successHint="Valid email"`,
			`  appearance="${this.appearance()}"`,
			...(this.prefixIcon() ? [`  prefixIcon="${this.prefixIcon()}"`] : []),
			...(this.clearButton() ? [`  [clearButton]="true"`] : []),
			...(this.maxLen() ? [`  [maxLength]="${this.maxLen()}"`] : []),
			`>`,
			`  <zyra-input type="${this.type()}" formControlName="email" />`,
			`</zyra-form-field>`,
			``,
			`// Component:`,
			`form = new FormGroup(${o}`,
			`  email: new FormControl('', [Validators.required, Validators.email])`,
			`${c});`,
		].join('\n');
	});

	// ── Methods ───────────────────────────────────────────────
	onValueChange(val: string, label: string): void {
		const time = new Date().toLocaleTimeString();
		this.eventLog.update(log =>
			[{ time, event: 'valueChange', msg: `${label}: "${val}"` }, ...log].slice(0, 10)
		);
	}

	onBlur(label: string): void {
		const time = new Date().toLocaleTimeString();
		this.eventLog.update(log =>
			[{ time, event: 'blurred', msg: label }, ...log].slice(0, 10)
		);
	}

	submitLogin(): void {
		this.loginForm.markAllAsTouched();
		if (this.loginForm.invalid) {
			this.toastService.error('Please fix the errors before submitting');
			return;
		}
		this.loginLoading.set(true);
		setTimeout(() => {
			this.loginLoading.set(false);
			this.toastService.success('Login successful!', {
				description: `Welcome back, ${this.loginForm.value.email}`
			});
		}, 1500);
	}

	submitRegister(): void {
		this.registerForm.markAllAsTouched();
		if (this.registerForm.invalid) {
			this.toastService.error('Please fix the errors before submitting');
			return;
		}
		this.regLoading.set(true);
		setTimeout(() => {
			this.regLoading.set(false);
			this.toastService.success('Account created!', {
				description: `Welcome, ${this.registerForm.value.name}!`
			});
		}, 1500);
	}

	submitProfile(): void {
		this.profileForm.markAllAsTouched();
		if (this.profileForm.invalid) {
			this.toastService.error('Please fix the errors');
			return;
		}
		this.toastService.success('Profile saved!', {
			description: `@${this.profileForm.value.username}`
		});
	}

	copy(): void {
		navigator.clipboard.writeText(this.generatedCode()).then(() => {
			this.copied.set(true);
			setTimeout(() => this.copied.set(false), 2000);
		});
	}

	reset(): void {
		this.type.set('text');
		this.size.set('md');
		this.appearance.set('outline');
		this.prefixIcon.set('');
		this.suffixIcon.set('');
		this.clearButton.set(false);
		this.loading.set(false);
		this.maxLen.set(null);
		this.hintText = 'This is a hint message';
		this.labelText = 'Label';
		this.eventLog.set([]);
	}

	simulateLoading(): void {
		this.loading.set(true);
		setTimeout(() => this.loading.set(false), 2000);
	}
}

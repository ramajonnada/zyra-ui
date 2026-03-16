// projects/zyra-ng-ui/src/lib/input/zyra-input.ts

import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type InputSize = 'sm' | 'md' | 'lg';

let inputIdCounter = 0;

@Component({
  selector:         'zyra-input',
  standalone:       true,
  changeDetection:  ChangeDetectionStrategy.OnPush,
  imports:          [FormsModule],
  providers: [
    {
      provide:     NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZyraInput),
      multi:       true,
    },
  ],
  templateUrl: './zyra-input.html',
  styleUrl:    './zyra-input.scss',
})
export class ZyraInput implements ControlValueAccessor, OnInit {

  // ── Inputs ────────────────────────────────────────────────
  type        = input<InputType>('text');
  size        = input<InputSize>('md');
  placeholder = input<string>('');
  readonly    = input<boolean>(false);
  id          = input<string>('');

  // ── Outputs ───────────────────────────────────────────────
  valueChange = output<string>();
  focused     = output<void>();
  blurred     = output<void>();

  // ── Internal state ────────────────────────────────────────
  innerValue   = signal('');
  isFocused    = signal(false);
  isTouched    = signal(false);
  isDisabled   = signal(false);
  showPassword = signal(false);

  // ── Unique ID — used by zyra-form-field to link label ─────
  readonly inputId = `zyra-input-${++inputIdCounter}`;

  // ── CVA callbacks ─────────────────────────────────────────
  private _onChange:  (val: string) => void = () => {};
  private _onTouched: () => void            = () => {};

  // ── ControlValueAccessor ──────────────────────────────────
  writeValue(val: string): void {
    this.innerValue.set(val ?? '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // ── Lazy NgControl injection — avoids NG0200 circular DI ──
  private _injector               = inject(Injector);
  private _ngControl: NgControl | null = null;

  ngOnInit(): void {
    this._ngControl = this._injector.get(NgControl, null, {
      self:     true,
      optional: true,
    });
  }

  // ── Expose NgControl for zyra-form-field to read ──────────
  get ngControl(): NgControl | null {
    return this._ngControl;
  }

  // ── Event handlers ────────────────────────────────────────
  onModelChange(val: string): void {
    this.innerValue.set(val);
    this._onChange(val);
    this.valueChange.emit(val);
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.focused.emit();
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.isTouched.set(true);
    this._onTouched();
    this.blurred.emit();
  }

  // ── Called by zyra-form-field to clear value ──────────────
  clear(): void {
    this.innerValue.set('');
    this._onChange('');
    this.valueChange.emit('');
  }

  // ── Called by zyra-form-field to toggle password ──────────
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}

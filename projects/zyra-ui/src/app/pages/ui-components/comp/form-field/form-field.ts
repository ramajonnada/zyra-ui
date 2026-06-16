import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
    ZyraFormField, ZyraInput, ZyraTextarea,
    ZyraButton, ZyraCard, ZyraToastContainer, ZyraToastService,
} from 'zyra-ng-ui';
import { inject } from '@angular/core';

@Component({
    selector: 'app-form-field',
    standalone: true,
    imports: [
        FormsModule, ReactiveFormsModule,
        ZyraFormField, ZyraInput, ZyraTextarea,
        ZyraButton, ZyraCard, ZyraToastContainer,
    ],
    templateUrl: './form-field.html',
    styleUrl: './form-field.scss',
})
export class FormField {
    private toast = inject(ZyraToastService);

    // ── Validation showcase ───────────────────────────────────
    requiredCtrl  = new FormControl('', Validators.required);
    emailCtrl     = new FormControl('', [Validators.required, Validators.email]);
    minLenCtrl    = new FormControl('', [Validators.required, Validators.minLength(6)]);
    maxLenCtrl    = new FormControl('', Validators.maxLength(20));
    bioCtrl       = new FormControl('', Validators.maxLength(160));

    // ── Contact form ──────────────────────────────────────────
    contactForm = new FormGroup({
        name:    new FormControl('', [Validators.required, Validators.minLength(2)]),
        email:   new FormControl('', [Validators.required, Validators.email]),
        subject: new FormControl('', Validators.required),
        message: new FormControl('', [Validators.required, Validators.minLength(20)]),
    });

    loading = signal(false);

    submit(): void {
        this.contactForm.markAllAsTouched();
        if (this.contactForm.invalid) {
            this.toast.error('Please fix the errors before submitting');
            return;
        }
        this.loading.set(true);
        setTimeout(() => {
            this.loading.set(false);
            this.toast.success('Message sent!', { description: 'We will get back to you shortly.' });
            this.contactForm.reset();
        }, 1500);
    }
}

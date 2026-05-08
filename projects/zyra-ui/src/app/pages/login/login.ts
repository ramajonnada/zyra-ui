import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ZyraBadge, ZyraButton, ZyraCard, ZyraFormField, ZyraInput } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule, RouterLink, ZyraBadge, ZyraButton, ZyraCard, ZyraFormField, ZyraInput],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {
    private readonly seo = inject(SeoService);

    readonly email = signal('');
    readonly password = signal('');
    readonly loading = signal(false);

    constructor() {
        this.seo.setSEO({
            title: 'Sign in - Zyra UI',
            description: 'Sign in to your Zyra UI account.',
            url: 'https://www.zyraui.dev/login',
            noindex: true,
        });
    }

    onSubmit(): void {
        if (!this.email() || !this.password()) return;
        this.loading.set(true);
        setTimeout(() => this.loading.set(false), 1500);
    }
}

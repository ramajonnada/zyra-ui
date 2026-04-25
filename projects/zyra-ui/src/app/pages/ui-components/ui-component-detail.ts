import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastVariant, ZyraBadge, ZyraCard, ZyraToastService } from 'zyra-ng-ui';
import { map } from 'rxjs';
import { getUiComponentShowcaseCard } from './ui-components.data';
import { Button } from './comp/button/button';
import { Badge } from './comp/badge/badge';
import { CardTest } from './comp/card-test/card-test';
import { Toast } from './comp/toast/toast';
import { Avatar } from './comp/avatar/avatar';
import { Input } from './comp/input/input';
import { Spinner } from './comp/spinner/spinner';
import { Tooltip } from './comp/tooltip/tooltip';

@Component({
    selector: 'app-ui-component-detail',
    imports: [
        FormsModule,
        RouterLink,
        ZyraBadge,
        ZyraCard,
        Button,
        Badge,
        CardTest,
        Toast,
        Avatar,
        Input,
        Spinner,
        Tooltip,
    ],
    templateUrl: './ui-component-detail.html',
    styleUrl: './ui-component-detail.scss',
})
export class UiComponentDetail {
    private readonly route = inject(ActivatedRoute);
    private readonly toast = inject(ZyraToastService);
    private copyResetTimer: ReturnType<typeof setTimeout> | null = null;

    demoEmail = 'hello@zyraui.dev';
    demoPassword = 'signals-only';
    demoSearch = 'button';
    copiedExampleSlug = signal<string | null>(null);

    private readonly componentSlug = toSignal(
        this.route.paramMap.pipe(map((params) => params.get('component'))),
        { initialValue: this.route.snapshot.paramMap.get('component') },
    );

    readonly component = computed(() => getUiComponentShowcaseCard(this.componentSlug()));

    showToast(variant: ToastVariant) {
        switch (variant) {
            case 'success':
                this.toast.success('Saved successfully', {
                    description: 'Zyra toast styles are active in the live preview.',
                });
                break;
            case 'warning':
                this.toast.warning('Heads up', {
                    description: 'Warnings can stay visible without interrupting the flow.',
                });
                break;
            case 'error':
                this.toast.error('Publish failed', {
                    description: 'Errors surface quickly with a strong visual state.',
                });
                break;
            case 'info':
            default:
                this.toast.info('New release available', {
                    description: 'Version 1.3.24 is ready to install.',
                });
        }
    }

    copyExampleCode(slug: string, code: string): void {
        if (!navigator?.clipboard) return;

        navigator.clipboard.writeText(code).then(() => {
            this.copiedExampleSlug.set(slug);

            if (this.copyResetTimer) {
                clearTimeout(this.copyResetTimer);
            }

            this.copyResetTimer = setTimeout(() => {
                if (this.copiedExampleSlug() === slug) {
                    this.copiedExampleSlug.set(null);
                }
            }, 1600);
        });
    }
}

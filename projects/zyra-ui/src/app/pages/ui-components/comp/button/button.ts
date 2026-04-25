import { Component, computed, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FormsModule } from '@angular/forms';
import { ZyraBadge, ZyraButton, ZyraToastService } from 'zyra-ng-ui';
import {
    appIcons,
    buttonLeftIconOptions,
    buttonRightIconOptions,
    type AppIconKey,
} from '../../../../shared/fontawesome-icons';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [FormsModule, ZyraButton, ZyraBadge, FaIconComponent],
    templateUrl: './button.html',
    styleUrl: './button.scss',
})
export class Button {
    toastService = inject(ZyraToastService);

    selectedVariant = signal<'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'>('primary');
    selectedSize = signal<'sm' | 'md' | 'lg'>('md');
    isLoading = signal(false);
    isDisabled = signal(false);
    isFullWidth = signal(false);
    iconLeft = signal<AppIconKey | null>(null);
    iconRight = signal<AppIconKey | null>(null);
    buttonLabel = 'Button';

    variants = ['primary', 'secondary', 'ghost', 'outline', 'danger'] as const;
    sizes = ['sm', 'md', 'lg'] as const;
    leftIconOptions = buttonLeftIconOptions;
    rightIconOptions = buttonRightIconOptions;

    leftPreviewIcon = computed(() => this.iconOrNull(this.iconLeft()));
    rightPreviewIcon = computed(() => this.iconOrNull(this.iconRight()));

    log(msg: string): void {
        this.toastService.info(msg);
    }

    copyCode(): void {
        const code = this.generatedCode();
        navigator.clipboard.writeText(code);
        this.toastService.success('Code copied to clipboard!');
    }

    generatedCode = computed(() => {
        let code = `<zyra-button variant="${this.selectedVariant()}" size="${this.selectedSize()}"`;
        if (this.isLoading()) code += ` [loading]="true"`;
        if (this.isDisabled()) code += ` [disabled]="true"`;
        if (this.isFullWidth()) code += ` [fullWidth]="true"`;
        code += `>`;
        if (this.iconLeft()) {
            code += `\n  <fa-icon slot="prefix" [icon]="appIcons.${this.iconLeft()}"></fa-icon>`;
        }
        code += `\n  ${this.buttonLabel || 'Button'}`;
        if (this.iconRight()) {
            code += `\n  <fa-icon slot="suffix" [icon]="appIcons.${this.iconRight()}"></fa-icon>`;
        }
        code += `\n</zyra-button>`;
        return code;
    });

    private iconOrNull(key: AppIconKey | null): IconDefinition | null {
        return key ? appIcons[key] : null;
    }
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ZyraBadge, ZyraButton, ZyraToastService } from 'zyra-ng-ui';
import {
    appIcons,
    buttonLeftIconOptions,
    buttonRightIconOptions,
    type AppIconKey,
} from '../../../../shared/fontawesome-icons';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-button',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraButton, ZyraBadge, FaIconComponent, Controls],
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
    buttonLabel = signal('Button');
    iconLeft = signal<AppIconKey | null>(null);
    iconRight = signal<AppIconKey | null>(null);

    leftIconOptions = buttonLeftIconOptions;
    rightIconOptions = buttonRightIconOptions;

    leftPreviewIcon = computed(() => this.iconOrNull(this.iconLeft()));
    rightPreviewIcon = computed(() => this.iconOrNull(this.iconRight()));

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'variant',
            label: 'variant',
            options: ['primary', 'secondary', 'ghost', 'outline', 'danger'],
            signal: this.selectedVariant as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['sm', 'md', 'lg'],
            signal: this.selectedSize as ReturnType<typeof signal<string>>,
        },
        {
            type: 'toggle',
            key: 'loading',
            label: 'loading',
            toggleLabel: 'loading state',
            signal: this.isLoading,
        },
        {
            type: 'toggle',
            key: 'disabled',
            label: 'disabled',
            toggleLabel: 'disabled state',
            signal: this.isDisabled,
        },
        {
            type: 'toggle',
            key: 'fullWidth',
            label: 'fullWidth',
            toggleLabel: 'full width',
            signal: this.isFullWidth,
        },
        {
            type: 'text',
            key: 'label',
            label: 'label',
            placeholder: 'Button text...',
            signal: this.buttonLabel,
        },
    ];

    log(msg: string): void {
        this.toastService.info(msg);
    }

    copyCode(): void {
        navigator.clipboard.writeText(this.generatedCode());
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
        code += `\n  ${this.buttonLabel() || 'Button'}`;
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

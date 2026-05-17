import { Component, computed, inject, signal } from '@angular/core';
import { ZyraAvatar, ZyraButton, ZyraBadge, ZyraCard, ZyraTooltip, ZyraToastContainer, ZyraToastService, ZyraThemeService, AvatarSize, AvatarVariant } from 'zyra-ng-ui';
import { Controls } from '../../shared/controls/controls';
import { ControlDef } from '../../shared/controls/control-def';

@Component({
    selector: 'app-avatar',
    standalone: true,
    templateUrl: './avatar.html',
    styleUrl: './avatar.scss',
    imports: [ZyraAvatar, ZyraButton, ZyraBadge, ZyraCard, ZyraTooltip, ZyraToastContainer, Controls],
})
export class Avatar {
    themeService = inject(ZyraThemeService);
    toastService = inject(ZyraToastService);

    size = signal<AvatarSize>('md');
    variant = signal<AvatarVariant>('teal');
    online = signal<boolean | null>(null);
    square = signal(false);
    name = signal('Arjun Kumar');
    src = signal('');

    sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    variants: AvatarVariant[] = ['teal', 'blue', 'purple', 'warm', 'neutral'];
    sampleNames = ['Arjun Kumar', 'Priya Sharma', 'Rohit Verma', 'Sneha Patel', 'Dev Zyra', 'A'];
    sampleImages = [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
        'broken-url.jpg',
    ];
    onlineOptions = [
        { label: 'none', value: null },
        { label: 'online', value: true },
        { label: 'offline', value: false },
    ];

    readonly controlDefs: ControlDef[] = [
        {
            type: 'button-group',
            key: 'name',
            label: 'name',
            options: this.sampleNames,
            signal: this.name,
        },
        {
            type: 'button-group',
            key: 'size',
            label: 'size',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            signal: this.size as ReturnType<typeof signal<string>>,
        },
        {
            type: 'button-group',
            key: 'variant',
            label: 'variant',
            options: ['teal', 'blue', 'purple', 'warm', 'neutral'],
            signal: this.variant as ReturnType<typeof signal<string>>,
        },
        {
            type: 'toggle',
            key: 'square',
            label: 'shape',
            toggleLabel: 'square',
            signal: this.square,
        },
    ];

    reset(): void {
        this.size.set('md');
        this.variant.set('teal');
        this.online.set(null);
        this.square.set(false);
        this.name.set('Arjun Kumar');
        this.src.set('');
    }

    onAvatarClick(name: string): void {
        this.toastService.info(`Clicked: ${name}`);
    }

    copyCode(): void {
        navigator.clipboard.writeText(this.generatedCode());
        this.toastService.success('Code copied to clipboard!');
    }

    generatedCode = computed(() => {
        let code = `<zyra-avatar\n  name="${this.escapeAttribute(this.name())}"`;
        if (this.src()) code += `\n  src="${this.escapeAttribute(this.src())}"`;
        code += `\n  size="${this.size()}"`;
        code += `\n  variant="${this.variant()}"`;
        if (this.online() !== null) code += `\n  [online]="${this.online()}"`;
        if (this.square()) code += `\n  [square]="true"`;
        code += `\n/>`;
        return code;
    });

    private escapeAttribute(value: string): string {
        return value.replaceAll('"', '&quot;');
    }
}

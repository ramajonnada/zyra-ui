import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ZyraTab, ZyraTabs, ZyraToastService } from 'zyra-ng-ui';

@Component({
    selector: 'app-preview',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraTabs, ZyraTab],
    templateUrl: './preview.html',
    styleUrl: './preview.scss',
})
export class Preview {
    private toastService = inject(ZyraToastService);

    readonly code = input('');
    readonly label = input('');
    readonly stageClass = input<'column' | 'vertical' | ''>('');

    readonly activeTab = signal<string>('preview');
    codeCopied = signal(false);
    private copyResetTimer?: ReturnType<typeof setTimeout>;

    onTabChange(id: string): void {
        this.activeTab.set(id);
    }

    copyCode(): void {
        navigator.clipboard.writeText(this.code());
        this.toastService.success('Code copied to clipboard!');
        this.codeCopied.set(true);
        clearTimeout(this.copyResetTimer);
        this.copyResetTimer = setTimeout(() => this.codeCopied.set(false), 2000);
    }
}

import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommandPaletteItem, ZyraButton, ZyraCommandPalette } from 'zyra-ng-ui';

const ITEMS: CommandPaletteItem[] = [
    { id: 'home', label: 'Go to Home', group: 'Navigation', shortcut: 'G H' },
    { id: 'components', label: 'Go to Components', group: 'Navigation', shortcut: 'G C' },
    { id: 'theming', label: 'Go to Theming', group: 'Navigation' },
    { id: 'new-file', label: 'Create new file', description: 'Start a blank component', group: 'Actions' },
    { id: 'copy-link', label: 'Copy page link', group: 'Actions' },
];

@Component({
    selector: 'pg-command-palette-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraCommandPalette, ZyraButton],
    template: `
        <zyra-button variant="outline" size="sm" (click)="paletteOpen.set(true)">
            Open (or press Ctrl/Cmd+K)
        </zyra-button>
        <zyra-command-palette [items]="items" [(open)]="paletteOpen" [placeholder]="placeholder()" />
    `,
})
export class CommandPaletteRenderer {
    placeholder = input<string>('Search commands…');

    readonly items = ITEMS;
    paletteOpen = signal(false);
}

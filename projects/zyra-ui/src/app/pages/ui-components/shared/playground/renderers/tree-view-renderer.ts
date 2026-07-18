import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TreeNode, ZyraTreeView } from 'zyra-ng-ui';

const DEMO_NODES: TreeNode[] = [
    {
        id: 'src',
        label: 'src',
        children: [
            {
                id: 'components',
                label: 'components',
                children: [
                    { id: 'button', label: 'button.ts' },
                    { id: 'input', label: 'input.ts' },
                ],
            },
            { id: 'app', label: 'app.ts' },
        ],
    },
    { id: 'readme', label: 'README.md' },
    { id: 'package', label: 'package.json' },
];

@Component({
    selector: 'pg-tree-view-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraTreeView],
    styles: [':host { display: block; width: 100%; max-width: 320px; }'],
    template: `
        <zyra-tree-view [nodes]="nodes" [selectionMode]="$any(selectionMode())" [size]="$any(size())" />
    `,
})
export class TreeViewRenderer {
    selectionMode = input<string>('none');
    size = input<string>('md');

    readonly nodes = DEMO_NODES;
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZyraJsonViewer } from 'zyra-ng-ui';

const SAMPLE = {
    id: 'usr_1a2b3c',
    name: 'Ava Patel',
    active: true,
    roles: ['admin', 'editor'],
    profile: {
        age: 29,
        location: 'Bengaluru',
        verified: true,
    },
    notes: null,
};

@Component({
    selector: 'pg-json-viewer-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraJsonViewer],
    template: `
        <div style="width: 320px;">
            <zyra-json-viewer [data]="data" [expandDepth]="resolvedExpandDepth()" [copyable]="copyable()" />
        </div>
    `,
})
export class JsonViewerRenderer {
    expandDepth = input<string>('1');
    copyable = input<boolean>(true);

    readonly data = SAMPLE;
    readonly resolvedExpandDepth = computed(() => Number(this.expandDepth()));
}

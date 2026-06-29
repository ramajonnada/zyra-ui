import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraTabs, ZyraTab } from 'zyra-ng-ui';

@Component({
    selector: 'pg-tabs-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraTabs, ZyraTab],
    styles: [':host { display: block; width: 100%; max-width: 560px; }'],
    template: `
        <zyra-tabs [variant]="$any(variant())" [size]="$any(size())" [orientation]="$any(orientation())">
            <zyra-tab
                label="Overview"
                [icon]="icon() ? '🏠' : ''"
                [badge]="badge() ? 4 : ''"
                [closeable]="closeable()"
            >Overview content goes here.</zyra-tab>
            <zyra-tab
                label="Details"
                [icon]="icon() ? '📋' : ''"
                [badge]="badge() ? 2 : ''"
                [closeable]="closeable()"
            >Details and specifications.</zyra-tab>
            <zyra-tab
                label="Activity"
                [icon]="icon() ? '⚡' : ''"
                [closeable]="closeable()"
            >Recent activity log.</zyra-tab>
            @if (disabled()) {
                <zyra-tab label="Disabled" [disabled]="true">Hidden.</zyra-tab>
            }
        </zyra-tabs>
    `,
})
export class TabsRenderer {
    variant     = input<string>('underline');
    size        = input<string>('md');
    orientation = input<string>('horizontal');
    disabled    = input(false, { transform: booleanAttribute });
    icon        = input(false, { transform: booleanAttribute });
    badge       = input(false, { transform: booleanAttribute });
    closeable   = input(false, { transform: booleanAttribute });
}

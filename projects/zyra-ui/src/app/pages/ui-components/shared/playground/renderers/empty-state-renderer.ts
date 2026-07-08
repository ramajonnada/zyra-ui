import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraEmptyState } from 'zyra-ng-ui';

@Component({
    selector: 'pg-empty-state-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraEmptyState],
    template: `
        <zyra-empty-state [title]="title()" [description]="description()" [size]="$any(size())" />
    `,
})
export class EmptyStateRenderer {
    title = input<string>('No results found');
    description = input<string>('Try adjusting your filters or search terms.');
    size = input<string>('md');
}

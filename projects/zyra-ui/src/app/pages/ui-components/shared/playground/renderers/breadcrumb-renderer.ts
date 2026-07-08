import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZyraBreadcrumb, ZyraBreadcrumbItem } from 'zyra-ng-ui';

const ALL_CRUMBS = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Code Block', href: '/components/code-block' },
    { label: 'Playground', href: '' },
];

@Component({
    selector: 'pg-breadcrumb-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraBreadcrumb, ZyraBreadcrumbItem],
    styles: [':host { display: block; width: 100%; }'],
    template: `
        <zyra-breadcrumb>
            @for (crumb of crumbs(); track crumb.label; let last = $last) {
                <zyra-breadcrumb-item [href]="crumb.href" [current]="last">{{
                    crumb.label
                }}</zyra-breadcrumb-item>
            }
        </zyra-breadcrumb>
    `,
})
export class BreadcrumbRenderer {
    depth = input<string>('3');

    crumbs = computed(() => ALL_CRUMBS.slice(0, Number(this.depth())));
}

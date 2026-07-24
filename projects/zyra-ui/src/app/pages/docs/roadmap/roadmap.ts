import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZyraBadge, ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraButton } from 'zyra-ng-ui';
import { SeoService } from '../../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../../shared/breadcrumb-jsonld';
import { COMPONENT_COUNT } from '../../ui-components/ui-components.data';

type PhaseStatus = 'done' | 'next' | 'planned';

interface Phase {
    status: PhaseStatus;
    statusLabel: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-docs-roadmap',
    imports: [RouterLink, ZyraButton, ZyraBadge, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './roadmap.html',
    styleUrl: './roadmap.scss',
})
export class DocsRoadmap implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);

    readonly componentCount = COMPONENT_COUNT;

    protected readonly crumbPath = internalPath;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Docs', url: 'https://www.zyraui.dev/docs' },
        { label: 'Roadmap', url: 'https://www.zyraui.dev/docs/roadmap' },
    ];

    readonly phases: readonly Phase[] = [
        {
            status: 'done',
            statusLabel: 'Complete — ongoing',
            title: 'Phase 1 — Foundation',
            description: `${COMPONENT_COUNT} free, open-source, MIT-licensed components across Actions, Data Display, Feedback, Forms, Identity, Layout, Navigation, Overlays, and Status — every one signals-first, standalone, typed, and accessible. This is the library as it ships today, and it keeps growing independently of everything below it.`,
        },
        {
            status: 'next',
            statusLabel: 'Now',
            title: 'Phase 2 — Pro Apps / Advanced Components',
            description:
                'A paid tier for teams that need more: a charting engine (Line, Bar, Pie first, then Area/Radar/Heatmap/Treemap), advanced data components (Data Grid, Virtual Table, Tree Grid, Pivot Table, Spreadsheet), editors (Rich Text, Markdown, JSON, Code), workflow tools (Kanban, Gantt, Workflow Builder), scheduling components, file management, and dashboard primitives. The free tier keeps growing independently — Pro is additive, not a restriction on what already shipped.',
        },
        {
            status: 'planned',
            statusLabel: 'Next',
            title: 'Phase 3 — Blocks / Templates / Accelerators',
            description:
                'Full starter templates (Admin Dashboard, CRM, ERP, HRMS, E-Commerce, and more) plus composable page-level blocks, all built from the Phase 1/2 component set — so teams can start from a working app, or just a working section, instead of a blank page.',
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Roadmap - Zyra UI Docs',
            description:
                'Where Zyra UI is headed: from a strong Angular component foundation to Pro components and starter templates.',
            url: 'https://www.zyraui.dev/docs/roadmap',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}

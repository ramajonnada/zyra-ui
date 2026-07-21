import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { catchError, of } from 'rxjs';
import { ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../shared/breadcrumb-jsonld';

@Component({
    selector: 'app-changelog',
    imports: [RouterLink, MarkdownModule, ZyraCard, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './changelog.html',
    styleUrl: './changelog.scss',
})
export class Changelog implements OnInit, OnDestroy {
    private readonly http = inject(HttpClient);
    private readonly seo = inject(SeoService);

    protected readonly crumbPath = internalPath;

    readonly markdownContent = signal('');
    readonly loading = signal(true);
    readonly error = signal('');

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Changelog', url: 'https://www.zyraui.dev/changelog' },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Changelog - Zyra UI',
            description: 'Every release of zyra-ng-ui, with what was added, fixed, and changed.',
            url: 'https://www.zyraui.dev/changelog',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));

        this.http
            .get('/changelog.md', { responseType: 'text' })
            .pipe(
                catchError(() => {
                    this.error.set('Unable to load the changelog right now. Please try again in a moment.');
                    return of('');
                }),
            )
            .subscribe((md) => {
                this.markdownContent.set(md);
                this.loading.set(false);
            });
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }
}

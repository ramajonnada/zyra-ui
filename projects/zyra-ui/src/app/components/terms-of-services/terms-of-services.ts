import { Component, OnInit, inject } from '@angular/core';
import { ZyraBadge, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';

@Component({
    selector: 'app-terms-of-services',
    imports: [ZyraBadge, ZyraCard],
    templateUrl: './terms-of-services.html',
    styleUrl: './terms-of-services.scss',
})
export class TermsOfServices implements OnInit {
    private readonly seo = inject(SeoService);

    readonly sections = [
        {
            title: 'Use of the website',
            body: 'You may use Zyra UI website content and examples to evaluate, learn, and build with the component library.',
        },
        {
            title: 'Open-source package',
            body: 'The package and source code are governed by the license published in the project repository.',
        },
        {
            title: 'No warranty',
            body: 'Documentation and examples are provided as-is. Always test components in your own application before production use.',
        },
        {
            title: 'Contact',
            body: 'Questions about these terms can be sent to zyraui.contact@gmail.com.',
        },
    ] as const;

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Terms of Service - Zyra UI',
            description: 'Read the Zyra UI website terms of service and project usage notes.',
            url: 'https://www.zyraui.dev/terms',
        });
    }
}

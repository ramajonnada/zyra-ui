import { Component, OnInit, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ZyraBadge, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { appIcons } from '../../shared/fontawesome-icons';

interface ContactMethod {
    label: string;
    value: string;
    href: string;
    icon: IconDefinition;
}

@Component({
    selector: 'app-contact',
    imports: [FaIconComponent, ZyraBadge, ZyraCard],
    templateUrl: './contact.html',
    styleUrl: './contact.scss',
})
export class Contact implements OnInit {
    private readonly seo = inject(SeoService);

    readonly contactMethods: readonly ContactMethod[] = [
        {
            label: 'Email',
            value: 'zyraui.contact@gmail.com',
            href: 'mailto:zyraui.contact@gmail.com',
            icon: appIcons.envelope,
        },
        {
            label: 'GitHub',
            value: 'github.com/ramajonnada/zyra-ui',
            href: 'https://github.com/ramajonnada/zyra-ui',
            icon: appIcons.github,
        },
        {
            label: 'Website',
            value: 'www.zyraui.dev',
            href: 'https://www.zyraui.dev',
            icon: appIcons.globe,
        },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Contact Zyra UI - Support, feedback, and collaboration',
            description:
                'Contact the Zyra UI team for component library questions, documentation feedback, collaboration, or support.',
            url: 'https://www.zyraui.dev/contact',
        });
    }
}

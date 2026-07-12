import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ZyraIcon, type ZyraIconData } from 'zyra-ng-ui';
import { ZyraBadge, ZyraBreadcrumb, ZyraBreadcrumbItem, ZyraButton, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { breadcrumbJsonLd, BreadcrumbLink, internalPath } from '../../shared/breadcrumb-jsonld';
import { github, npm as npmIcon, envelope, folder, cubes, message, palette, bolt, codeBranch, universalAccess, rocket, instagram, globe, swatchbook, boxOpen, moon, waveSquare, check, lock, circleInfo, triangleExclamation, alignLeft, puzzlePiece, sun, caretLeft, caretRight, handPointer, certificate, square, circleUser, keyboard, spinner } from 'zyra-ng-ui';

interface ContactMethod {
    label: string;
    value: string;
    href: string;
    icon: ZyraIconData;
}

@Component({
    selector: 'app-contact',
    imports: [RouterLink, ZyraIcon, ZyraBadge, ZyraButton, ZyraCard, ZyraBreadcrumb, ZyraBreadcrumbItem],
    templateUrl: './contact.html',
    styleUrl: './contact.scss',
})
export class Contact implements OnInit, OnDestroy {
    private readonly seo = inject(SeoService);
    private readonly document = inject(DOCUMENT);

    readonly contactMethods: readonly ContactMethod[] = [
        {
            label: 'Email',
            value: 'zyrangui.contact@gmail.com',
            href: 'mailto:zyrangui.contact@gmail.com',
            icon: envelope,
        },
        {
            label: 'Instagram',
            value: '@zyrangui',
            href: 'https://www.instagram.com/zyrangui/',
            icon: instagram,
        },
        {
            label: 'GitHub',
            value: 'github.com/ramajonnada/zyra-ui',
            href: 'https://github.com/ramajonnada/zyra-ui',
            icon: github,
        },
        {
            label: 'Website',
            value: 'www.zyraui.dev',
            href: 'https://www.zyraui.dev',
            icon: globe,
        },
    ];

    protected readonly crumbPath = internalPath;

    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
        { label: 'Home', url: 'https://www.zyraui.dev/' },
        { label: 'Contact', url: 'https://www.zyraui.dev/contact' },
    ];

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Contact Zyra UI - Support, feedback, and collaboration',
            description:
                'Contact the Zyra UI team via email or Instagram for component library questions, documentation feedback, or collaboration.',
            url: 'https://www.zyraui.dev/contact',
        });

        this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));
    }

    ngOnDestroy(): void {
        this.seo.removeJsonLd('breadcrumb-jsonld');
    }

    openEmail(): void {
        this.document.location.href = 'mailto:zyrangui.contact@gmail.com';
    }
}

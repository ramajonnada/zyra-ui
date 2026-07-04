import { Component, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ZyraIcon, type ZyraIconData } from 'zyra-ng-ui';
import { ZyraBadge, ZyraButton, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';
import { github, npm as npmIcon, envelope, folder, cubes, message, palette, bolt, codeBranch, universalAccess, rocket, instagram, globe, swatchbook, boxOpen, moon, waveSquare, check, lock, circleInfo, triangleExclamation, alignLeft, puzzlePiece, sun, caretLeft, caretRight, handPointer, certificate, square, circleUser, keyboard, spinner } from 'zyra-ng-ui';

interface ContactMethod {
    label: string;
    value: string;
    href: string;
    icon: ZyraIconData;
}

@Component({
    selector: 'app-contact',
    imports: [ZyraIcon, ZyraBadge, ZyraButton, ZyraCard],
    templateUrl: './contact.html',
    styleUrl: './contact.scss',
})
export class Contact implements OnInit {
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

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Contact Zyra UI - Support, feedback, and collaboration',
            description:
                'Contact the Zyra UI team via email or Instagram for component library questions, documentation feedback, or collaboration.',
            url: 'https://www.zyraui.dev/contact',
        });
    }

    openEmail(): void {
        this.document.location.href = 'mailto:zyrangui.contact@gmail.com';
    }
}

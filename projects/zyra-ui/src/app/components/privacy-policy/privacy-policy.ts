import { Component, OnInit, inject } from '@angular/core';
import { ZyraBadge, ZyraCard } from 'zyra-ng-ui';
import { SeoService } from '../../../seo/seo.service';

@Component({
    selector: 'app-privacy-policy',
    imports: [ZyraBadge, ZyraCard],
    templateUrl: './privacy-policy.html',
    styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy implements OnInit {
    private readonly seo = inject(SeoService);

    readonly sections = [
        {
            title: 'Information we collect',
            body: 'We collect only the information needed to operate the website, respond to contact requests, and understand public documentation usage.',
        },
        {
            title: 'How we use information',
            body: 'Information is used to improve Zyra UI content, maintain the public website, and reply to messages you send to the project.',
        },
        {
            title: 'Third-party services',
            body: 'The website may use hosting, analytics, advertising, package registry, and GitHub services that process data under their own policies.',
        },
        {
            title: 'Contact',
            body: 'Questions about privacy can be sent to zyraui.contact@gmail.com.',
        },
    ] as const;

    ngOnInit(): void {
        this.seo.setSEO({
            title: 'Privacy Policy - Zyra UI',
            description: 'Read the Zyra UI privacy policy for website visitors and project users.',
            url: 'https://www.zyraui.dev/privacy',
        });
    }
}

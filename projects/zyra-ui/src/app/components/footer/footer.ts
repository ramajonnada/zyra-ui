import { Component } from '@angular/core';
import { ZyraIcon, type ZyraIconData } from 'zyra-ng-ui';
import { RouterLink } from '@angular/router';
import { github, npm as npmIcon, envelope } from 'zyra-ng-ui';

interface FooterLink {
	label: string;
	href?: string;
	route?: string;
	icon?: ZyraIconData;
}

interface FooterSection {
	title: string;
	links: readonly FooterLink[];
}

interface FooterSocial {
	label: string;
	href: string;
	icon: ZyraIconData;
}

@Component({
	selector: 'app-footer',
	imports: [RouterLink, ZyraIcon],
	templateUrl: './footer.html',
	styleUrl: './footer.scss',
})
export class Footer {
	readonly year = new Date().getFullYear();
	readonly sections: readonly FooterSection[] = [
		{
			title: 'Product',
			links: [
				{ label: 'Components', route: '/components' },
				{ label: 'Docs', route: '/docs' },
				{ label: 'Blog', route: '/blog' },
				{ label: 'About', route: '/about' },
				{ label: 'Contact', route: '/contact' },
			],
		},
		{
			title: 'Resources',
			links: [
				{ label: 'Getting started', route: '/docs' },
				{ label: 'GitHub', href: 'https://github.com/ramajonnada/zyra-ui', icon: github },
				{ label: 'npm', href: 'https://www.npmjs.com/package/zyra-ng-ui', icon: npmIcon },
				{ label: 'Examples', route: '/components' },
			],
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Privacy', route: '/privacy' },
				{ label: 'Terms', route: '/terms' },
				{
					label: 'License',
					href: 'https://github.com/ramajonnada/zyra-ui/blob/main/LICENSE',
				},
			],
		},
	];
	readonly socials: readonly FooterSocial[] = [
		{
			label: 'GitHub',
			href: 'https://github.com/ramajonnada/zyra-ui',
			icon: github,
		},
		{
			label: 'npm',
			href: 'https://www.npmjs.com/package/zyra-ng-ui',
			icon: npmIcon,
		},
		{
			label: 'Email',
			href: 'mailto:zyraui.contact@gmail.com',
			icon: envelope,
		},
	];
}

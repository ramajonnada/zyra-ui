import { Component, inject } from '@angular/core';
import { SeoService } from '../../../seo/seo.service';

@Component({
	selector: 'app-about',
	imports: [],
	templateUrl: './about.html',
	styleUrl: './about.scss',
})
export class About {

	private seo = inject(SeoService);

	ngOnInit(): void {
		this.seo.setSEO({
			title: 'About Zyra UI',
			description: 'Zyra UI is a modern Angular UI library built for performance and developer experience.',
			url: 'https://www.zyraui.dev/about'
		});
	}
}

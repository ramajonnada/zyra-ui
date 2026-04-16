import { Component } from '@angular/core';
import { Home, InstallStep } from "../home/home";

@Component({
	selector: 'app-docs',
	imports: [],
	templateUrl: './docs.html',
	styleUrl: './docs.scss',
})
export class Docs {


	readonly installSteps: InstallStep[] = [
		{
			step: '1',
			title: 'Install the package',
			description:
				'Add Zyra NG UI to your Angular 21+ workspace with your package manager of choice.',
			code: '# npm\nnpm install zyra-ng-ui\n\n# pnpm\npnpm add zyra-ng-ui',
		},
		{
			step: '2',
			title: 'Register the provider',
			description:
				'Enable the theme service once at bootstrap so tokens and runtime theme switching are ready immediately.',
			code: "import { provideZyra } from 'zyra-ng-ui';\n\nproviders: [\n  provideZyra({ theme: 'dark' })\n]",
		},
		{
			step: '3',
			title: 'Start building',
			description:
				'Pull in any standalone component and use it directly in your feature templates.',
			code: "import { ZyraButton } from 'zyra-ng-ui';\n\n@Component({\n  imports: [ZyraButton],\n})",
		},
	];
}

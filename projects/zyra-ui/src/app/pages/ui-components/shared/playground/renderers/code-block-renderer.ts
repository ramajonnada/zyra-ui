import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraCodeBlock } from 'zyra-ng-ui';

const SAMPLE_CODE = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('Zyra'));`;

@Component({
    selector: 'pg-code-block-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraCodeBlock],
    styles: [':host { display: block; width: 100%; }'],
    template: `
        <zyra-code-block
            [code]="code"
            [language]="language()"
            [filename]="filename()"
            [lineNumbers]="lineNumbers()"
            [copyable]="copyable()"
        />
    `,
})
export class CodeBlockRenderer {
    readonly code = SAMPLE_CODE;

    language = input<string>('typescript');
    filename = input<string>('greet.ts');
    lineNumbers = input<boolean>(false);
    copyable = input<boolean>(true);
}

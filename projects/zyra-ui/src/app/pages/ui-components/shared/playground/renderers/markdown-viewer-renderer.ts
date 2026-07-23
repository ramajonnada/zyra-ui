import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraMarkdownViewer } from 'zyra-ng-ui';

const SAMPLE = `# Release notes

Zyra UI now ships **60 accessible** components, with *first-class* theming.

- Copy-paste friendly
- Token-driven, re-themeable
- Built for Angular signals

\`\`\`ts
const greeting = 'hello world';
\`\`\`

> Read the [full changelog](https://zyraui.dev/changelog) for details.
`;

@Component({
    selector: 'pg-markdown-viewer-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraMarkdownViewer],
    template: `
        <div style="width: 360px;">
            <zyra-markdown-viewer [content]="content" [linkTarget]="$any(linkTarget())" />
        </div>
    `,
})
export class MarkdownViewerRenderer {
    linkTarget = input<string>('_blank');
    readonly content = SAMPLE;
}

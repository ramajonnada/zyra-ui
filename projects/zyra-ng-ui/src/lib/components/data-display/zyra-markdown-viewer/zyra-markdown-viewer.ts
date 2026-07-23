import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZyraCodeBlock } from '../zyra-code-block/zyra-code-block';
import { parseMarkdown } from './zyra-markdown-viewer-parser';

export type MarkdownLinkTarget = '_blank' | '_self';

@Component({
    selector: 'zyra-markdown-viewer',
    standalone: true,
    imports: [ZyraCodeBlock, NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './zyra-markdown-viewer.html',
    styleUrl: './zyra-markdown-viewer.scss',
})
export class ZyraMarkdownViewer {
    // ── Inputs ────────────────────────────────────────────────
    content = input<string>('');
    /** Strips raw `<...>`-looking HTML out of the source text instead of rendering it literally. */
    sanitize = input<boolean>(true);
    linkTarget = input<MarkdownLinkTarget>('_blank');

    // ── Computed ──────────────────────────────────────────────
    blocks = computed(() => parseMarkdown(this.content(), this.sanitize()));

    linkRel = computed<string | null>(() => (this.linkTarget() === '_blank' ? 'noopener noreferrer' : null));
}

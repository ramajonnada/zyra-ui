import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZyraHeader, ZyraHeaderStart, ZyraHeaderNav, ZyraHeaderEnd, ZyraButton } from 'zyra-ng-ui';

@Component({
    selector: 'pg-header-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraHeader, ZyraHeaderStart, ZyraHeaderNav, ZyraHeaderEnd, ZyraButton],
    styles: [
        `
            :host {
                display: block;
                width: 100%;
            }

            .pg-header-frame {
                border: 1px solid var(--zyra-color-border);
                border-radius: var(--zyra-radius-md);
                overflow: hidden;
            }
        `,
    ],
    template: `
        <div class="pg-header-frame">
            <zyra-header
                [align]="$any(align())"
                [variant]="$any(variant())"
                [transparent]="transparent()"
                [mobileBreakpoint]="mobileView() ? 4000 : 768"
                position="static"
            >
                <a zyraHeaderStart>Brand</a>
                <nav zyraHeaderNav>
                    <a>Docs</a>
                    <a>Blog</a>
                    <a>Pricing</a>
                </nav>
                <div zyraHeaderEnd>
                    <zyra-button size="sm">Get started</zyra-button>
                </div>
            </zyra-header>
        </div>
    `,
})
export class HeaderRenderer {
    align = input<string>('split');
    variant = input<string>('contained');
    transparent = input(false, { transform: booleanAttribute });
    mobileView = input(false, { transform: booleanAttribute });
}

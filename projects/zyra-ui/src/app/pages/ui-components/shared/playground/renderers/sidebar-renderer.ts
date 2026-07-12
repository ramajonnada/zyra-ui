import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
    boxOpen,
    certificate,
    circleUser,
    codeBranch,
} from 'zyra-ng-ui';

@Component({
    selector: 'pg-sidebar-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
    styles: [
        `
            :host {
                display: block;
                width: 100%;
            }

            .pg-sidebar-frame {
                height: 360px;
                border: 1px solid var(--zyra-color-border);
                border-radius: var(--zyra-radius-md);
                overflow: hidden;
            }
        `,
    ],
    template: `
        <!-- <div class="pg-sidebar-frame">
            <zyra-sidebar [collapsed]="collapsed()">
                <div sidebar-header>Zyra UI</div>
                <zyra-sidebar-section heading="General">
                    <a zyra-sidebar-item [icon]="boxOpen" [active]="true">Overview</a>
                    <a zyra-sidebar-item [icon]="codeBranch">Projects</a>
                </zyra-sidebar-section>
                <zyra-sidebar-section heading="Account">
                    <a zyra-sidebar-item [icon]="circleUser" [badge]="badge() ? '3' : ''">Profile</a>
                    <a zyra-sidebar-item [icon]="certificate" [disabled]="disabled()">Billing</a>
                </zyra-sidebar-section>
            </zyra-sidebar>
        </div> -->
    `,
})
export class SidebarRenderer {
    collapsed = input<boolean>(false);
    badge = input<boolean>(true);
    disabled = input<boolean>(false);

    readonly boxOpen = boxOpen;
    readonly codeBranch = codeBranch;
    readonly circleUser = circleUser;
    readonly certificate = certificate;
}

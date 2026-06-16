import { Component, signal } from '@angular/core';
import { ZyraTabs, ZyraTab, ZyraCard, ZyraBadge } from 'zyra-ng-ui';

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [ZyraTabs, ZyraTab, ZyraCard, ZyraBadge],
    templateUrl: './tabs.html',
    styleUrl: './tabs.scss',
})
export class Tabs {
    activeTab = signal('');
}

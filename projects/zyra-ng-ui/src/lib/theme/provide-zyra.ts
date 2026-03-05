// projects/zyra-ng-ui/src/lib/provide-zyra.ts

import {
    EnvironmentProviders,
    inject,
    makeEnvironmentProviders,
    provideAppInitializer,
} from '@angular/core';
import { ThemeService } from './theme-service';
import { ZyraThemeType } from './theme-type';

export interface ZyraUIConfig {
    theme?: ZyraThemeType; // optional: 'light' | 'dark'
}

export function provideZyraUI(config?: ZyraUIConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideAppInitializer(() => {
            const themeService = inject(ThemeService);
            themeService.initTheme(config?.theme); // auto-runs before app starts
        }),
    ]);
}

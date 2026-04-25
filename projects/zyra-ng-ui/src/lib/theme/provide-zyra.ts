// // projects/zyra-ng-ui/src/lib/provide-zyra.ts

// import {
//     EnvironmentProviders,
//     inject,
//     makeEnvironmentProviders,
//     provideAppInitializer,
// } from '@angular/core';
// import { ThemeService } from './theme-service';
// import { ZyraThemeType } from './theme-type';

// export interface ZyraUIConfig {
//     theme?: ZyraThemeType; // optional: 'light' | 'dark'
// }

// export function provideZyraUI(config?: ZyraUIConfig): EnvironmentProviders {
//     return makeEnvironmentProviders([
//         provideAppInitializer(() => {
//             const themeService = inject(ThemeService);
//             themeService.initTheme(config?.theme); // auto-runs before app starts
//         }),
//     ]);
// }

// ============================================================
// ZYRA NG UI — Provider (provide-zyra.ts)
// Use in app.config.ts to bootstrap Zyra
// ============================================================

import {
    EnvironmentProviders,
    makeEnvironmentProviders,
    APP_INITIALIZER,
    inject,
} from '@angular/core';
import { ZyraConfig, ZYRA_CONFIG } from './theme-type';
import { ZyraThemeService } from './theme-service';

export function provideZyra(config: ZyraConfig = {}): EnvironmentProviders {
    return makeEnvironmentProviders([
        // Provide config
        {
            provide: ZYRA_CONFIG,
            useValue: {
                theme: 'dark',
                storageKey: 'zyra-theme',
                respectSystemTheme: true,
                ...config,
            } as ZyraConfig,
        },
        // Eagerly initialize theme on app start
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
                inject(ZyraThemeService);
                return () => {
                    // Theme service constructor handles DOM setup via effect()
                    // This ensures it runs before first render
                    return Promise.resolve();
                };
            },
            multi: true,
        },
    ]);
}

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

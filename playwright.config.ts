import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	timeout: 30_000,
	fullyParallel: true,
	workers: 4,
	reporter: [['list'], ['json', { outputFile: 'e2e/a11y-results.json' }]],
	use: {
		baseURL: 'http://localhost:4300',
	},
	webServer: {
		command: 'npx ng serve zyra-ui --port 4300',
		url: 'http://localhost:4300',
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});

import { Component, inject, signal } from '@angular/core';
import { ZyraBadge, ZyraButton, ZyraThemeService, ZyraToastContainer, ZyraToastItem, ZyraToastService } from 'zyra-ng-ui';

@Component({
	selector: 'app-root',
	imports: [ZyraButton, ZyraBadge,ZyraToastContainer],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected readonly title = signal('test-app');

	private _themService: ZyraThemeService = inject(ZyraThemeService);
	readonly theme = this._themService.theme();

	$$toggle() {
		this._themService.toggle();
	}



	toastService = inject(ZyraToastService);

	// ── State ─────────────────────────────────────────────────
	isDisabled = signal(false);
	saveDisabled = signal(false);
	eventLog = signal<{ time: string; msg: string }[]>([]);
	loadingMap: Record<string, boolean> = {
		save: false, upload: false, delete: false, async: false,
	};

	// ── Data for combo table ──────────────────────────────────
	variants = ['primary', 'secondary', 'ghost', 'outline', 'danger'] as const;
	sizes = ['sm', 'md', 'lg'] as const;

	// ── Methods ───────────────────────────────────────────────
	log(msg: string): void {
		const time = new Date().toLocaleTimeString();
		this.eventLog.update(log => [{ time, msg }, ...log].slice(0, 8));
		this.toastService.info(msg);
	}

	onClicked(event: MouseEvent): void {
		this.log(`clicked — x:${event.clientX} y:${event.clientY}`);
	}

	triggerLoading(key: string, duration: number): void {
		this.loadingMap[key] = true;
		setTimeout(() => {
			this.loadingMap[key] = false;
			this.toastService.success(`${key} complete!`);
		}, duration);
	}

	asyncSave(): void {
		this.loadingMap['async'] = true;
		setTimeout(() => {
			this.loadingMap['async'] = false;
			this.saveDisabled.set(true);
			this.toastService.success('Saved!', { description: 'Changes applied successfully.' });
		}, 2000);
	}

	resetSave(): void {
		this.saveDisabled.set(false);
		this.loadingMap['async'] = false;
	}
}

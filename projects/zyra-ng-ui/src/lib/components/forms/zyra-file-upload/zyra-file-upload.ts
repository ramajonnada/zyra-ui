import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    forwardRef,
    signal,
    viewChild,
    input,
    output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ZyraIcon as ZyraIconComponent } from '../../../internal/zyra-icon/zyra-icon';
import { boxOpen, xmark } from '../../../shared/zyra-icons';

export interface RejectedFile {
    file: File;
    reason: 'size' | 'type' | 'count';
}

let fileUploadIdCounter = 0;

@Component({
    selector: 'zyra-file-upload',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ZyraIconComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZyraFileUpload),
            multi: true,
        },
    ],
    templateUrl: './zyra-file-upload.html',
    styleUrl: './zyra-file-upload.scss',
})
export class ZyraFileUpload implements ControlValueAccessor {
    // ── Inputs ────────────────────────────────────────────────
    multiple = input(false, { transform: booleanAttribute });
    accept = input<string>('');
    disabled = input(false, { transform: booleanAttribute });
    maxSizeMb = input<number | null>(null);
    maxFiles = input<number | null>(null);
    id = input<string>('');

    // ── Outputs ───────────────────────────────────────────────
    filesChange = output<File[]>();
    rejected = output<RejectedFile[]>();

    // ── Internal state ────────────────────────────────────────
    readonly files = signal<File[]>([]);
    readonly isDragOver = signal(false);
    private readonly _cvaDisabled = signal(false);

    private readonly _fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

    // ── Unique ID ─────────────────────────────────────────────
    readonly uploadId = `zyr-file-upload-${++fileUploadIdCounter}`;
    readonly resolvedId = computed(() => this.id() || this.uploadId);

    // ── Computed ──────────────────────────────────────────────
    readonly isDisabled = computed(() => this.disabled() || this._cvaDisabled());

    readonly hostClass = computed(() => {
        const parts = ['zyr-file-upload'];
        if (this.isDragOver()) parts.push('zyr-file-upload--dragover');
        if (this.isDisabled()) parts.push('zyr-file-upload--disabled');
        return parts.join(' ');
    });

    readonly icons = { boxOpen, xmark };

    // ── CVA callbacks ─────────────────────────────────────────
    private _onChange: (val: File[]) => void = () => undefined;
    private _onTouched: () => void = () => undefined;

    writeValue(val: File[]): void {
        this.files.set(Array.isArray(val) ? val : []);
    }

    registerOnChange(fn: (val: File[]) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._cvaDisabled.set(isDisabled);
    }

    // ── Interaction ───────────────────────────────────────────
    openPicker(): void {
        if (this.isDisabled()) return;
        this._fileInput()?.nativeElement.click();
    }

    onFileInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this._addFiles(input.files);
        input.value = '';
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        if (this.isDisabled()) return;
        this.isDragOver.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver.set(false);
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver.set(false);
        if (this.isDisabled()) return;
        this._addFiles(event.dataTransfer?.files ?? null);
    }

    removeFile(index: number): void {
        if (this.isDisabled()) return;
        const next = this.files().filter((_, i) => i !== index);
        this._commit(next);
    }

    formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    // ── Private helpers ───────────────────────────────────────
    private _addFiles(fileList: FileList | null): void {
        if (!fileList || fileList.length === 0) return;

        const incoming = Array.from(fileList);
        const accepted: File[] = [];
        const rejectedFiles: RejectedFile[] = [];
        const existing = this.multiple() ? this.files() : [];
        const limit = this.maxFiles();

        for (const file of incoming) {
            if (!this._matchesAccept(file)) {
                rejectedFiles.push({ file, reason: 'type' });
                continue;
            }
            const maxBytes = (this.maxSizeMb() ?? Infinity) * 1024 * 1024;
            if (file.size > maxBytes) {
                rejectedFiles.push({ file, reason: 'size' });
                continue;
            }
            if (limit !== null && existing.length + accepted.length >= limit) {
                rejectedFiles.push({ file, reason: 'count' });
                continue;
            }
            accepted.push(file);
        }

        if (accepted.length) {
            const next = this.multiple() ? [...existing, ...accepted] : accepted.slice(0, 1);
            this._commit(next);
        }
        if (rejectedFiles.length) {
            this.rejected.emit(rejectedFiles);
        }
    }

    private _matchesAccept(file: File): boolean {
        const accept = this.accept().trim();
        if (!accept) return true;

        return accept.split(',').some((pattern) => {
            const p = pattern.trim();
            if (!p) return false;
            if (p.startsWith('.')) return file.name.toLowerCase().endsWith(p.toLowerCase());
            if (p.endsWith('/*')) return file.type.startsWith(p.slice(0, -1));
            return file.type === p;
        });
    }

    private _commit(files: File[]): void {
        this.files.set(files);
        this._onChange(files);
        this._onTouched();
        this.filesChange.emit(files);
    }
}

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZyraFileUpload } from './zyra-file-upload';

function fakeFileList(files: File[]): FileList {
    const list = files as unknown as FileList;
    (list as unknown as { item: (i: number) => File }).item = (i: number) => files[i];
    return list;
}

function fakeChangeEvent(files: File[]): Event {
    return { target: { files: fakeFileList(files), value: '' } } as unknown as Event;
}

function fakeDropEvent(files: File[]): DragEvent {
    return {
        preventDefault: () => undefined,
        dataTransfer: { files: fakeFileList(files) },
    } as unknown as DragEvent;
}

@Component({
    standalone: true,
    imports: [ZyraFileUpload],
    template: `
        <zyra-file-upload
            [multiple]="multiple()"
            [accept]="accept()"
            [maxSizeMb]="maxSizeMb()"
            [maxFiles]="maxFiles()"
            [disabled]="disabled()"
        />
    `,
})
class FileUploadHostComponent {
    multiple = signal(false);
    accept = signal('');
    maxSizeMb = signal<number | null>(null);
    maxFiles = signal<number | null>(null);
    disabled = signal(false);
}

describe('ZyraFileUpload', () => {
    let fixture: ComponentFixture<FileUploadHostComponent>;
    let component: ZyraFileUpload;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileUploadHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FileUploadHostComponent);
        component = fixture.debugElement.children[0].componentInstance as ZyraFileUpload;
        fixture.detectChanges();
    });

    it('renders a dropzone label pointing at the native file input', () => {
        const dropzone: HTMLLabelElement = fixture.nativeElement.querySelector(
            '.zyr-file-upload__dropzone',
        );
        const input: HTMLInputElement = fixture.nativeElement.querySelector(
            '.zyr-file-upload__native-input',
        );
        expect(dropzone).not.toBeNull();
        expect(dropzone.tagName).toBe('LABEL');
        expect(dropzone.getAttribute('for')).toBe(input.id);
    });

    it('adds a file selected via the native input', () => {
        const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
        component.onFileInputChange(fakeChangeEvent([file]));
        fixture.detectChanges();

        expect(component.files()).toEqual([file]);
    });

    it('replaces the file in single mode when a new one is chosen', () => {
        const first = new File(['a'], 'a.txt', { type: 'text/plain' });
        const second = new File(['b'], 'b.txt', { type: 'text/plain' });
        component.onFileInputChange(fakeChangeEvent([first]));
        component.onFileInputChange(fakeChangeEvent([second]));
        fixture.detectChanges();

        expect(component.files()).toEqual([second]);
    });

    it('accumulates files in multiple mode', () => {
        fixture.componentInstance.multiple.set(true);
        fixture.detectChanges();

        const first = new File(['a'], 'a.txt', { type: 'text/plain' });
        const second = new File(['b'], 'b.txt', { type: 'text/plain' });
        component.onFileInputChange(fakeChangeEvent([first]));
        component.onFileInputChange(fakeChangeEvent([second]));
        fixture.detectChanges();

        expect(component.files()).toEqual([first, second]);
    });

    it('accepts a dropped file and toggles dragover state', () => {
        component.onDragOver({ preventDefault: () => undefined } as unknown as DragEvent);
        fixture.detectChanges();
        expect(component.isDragOver()).toBeTrue();
        expect(fixture.nativeElement.querySelector('.zyr-file-upload--dragover')).not.toBeNull();

        const file = new File(['x'], 'x.txt', { type: 'text/plain' });
        component.onDrop(fakeDropEvent([file]));
        fixture.detectChanges();

        expect(component.isDragOver()).toBeFalse();
        expect(component.files()).toEqual([file]);
    });

    it('rejects a file that does not match accept', () => {
        fixture.componentInstance.accept.set('.pdf');
        fixture.detectChanges();

        const rejected: { file: File; reason: string }[][] = [];
        component.rejected.subscribe((r) => rejected.push(r));

        const file = new File(['x'], 'photo.png', { type: 'image/png' });
        component.onFileInputChange(fakeChangeEvent([file]));
        fixture.detectChanges();

        expect(component.files()).toEqual([]);
        expect(rejected[0][0].reason).toBe('type');
    });

    it('rejects a file that exceeds maxSizeMb', () => {
        fixture.componentInstance.maxSizeMb.set(0.000001); // ~1 byte
        fixture.detectChanges();

        const rejected: { file: File; reason: string }[][] = [];
        component.rejected.subscribe((r) => rejected.push(r));

        const file = new File(['this is definitely more than one byte'], 'big.txt');
        component.onFileInputChange(fakeChangeEvent([file]));
        fixture.detectChanges();

        expect(component.files()).toEqual([]);
        expect(rejected[0][0].reason).toBe('size');
    });

    it('rejects files beyond maxFiles', () => {
        fixture.componentInstance.multiple.set(true);
        fixture.componentInstance.maxFiles.set(1);
        fixture.detectChanges();

        const rejected: { file: File; reason: string }[][] = [];
        component.rejected.subscribe((r) => rejected.push(r));

        const first = new File(['a'], 'a.txt');
        const second = new File(['b'], 'b.txt');
        component.onFileInputChange(fakeChangeEvent([first, second]));
        fixture.detectChanges();

        expect(component.files()).toEqual([first]);
        expect(rejected[0][0].reason).toBe('count');
    });

    it('removes a file from the list', () => {
        fixture.componentInstance.multiple.set(true);
        fixture.detectChanges();

        const first = new File(['a'], 'a.txt');
        const second = new File(['b'], 'b.txt');
        component.onFileInputChange(fakeChangeEvent([first, second]));
        fixture.detectChanges();

        component.removeFile(0);
        fixture.detectChanges();

        expect(component.files()).toEqual([second]);
    });

    it('renders a list item per selected file with formatted size', () => {
        const file = new File(['hello'], 'hello.txt');
        component.onFileInputChange(fakeChangeEvent([file]));
        fixture.detectChanges();

        const item: HTMLElement = fixture.nativeElement.querySelector('.zyr-file-upload__item');
        expect(item.textContent).toContain('hello.txt');
    });

    it('does not accept files when disabled', () => {
        fixture.componentInstance.disabled.set(true);
        fixture.detectChanges();

        const file = new File(['x'], 'x.txt');
        component.onDrop(fakeDropEvent([file]));
        fixture.detectChanges();

        expect(component.files()).toEqual([]);
    });

    it('writes files via writeValue', () => {
        const file = new File(['x'], 'x.txt');
        component.writeValue([file]);
        fixture.detectChanges();

        expect(component.files()).toEqual([file]);
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Preview } from './preview';

describe('Preview', () => {
    let fixture: ComponentFixture<Preview>;
    let component: Preview;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Preview],
        }).compileComponents();

        fixture = TestBed.createComponent(Preview);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── signal defaults ───────────────────────────────────────────────────────
    it('activeTab defaults to "preview"', () => {
        expect(component.activeTab()).toBe('preview');
    });

    it('codeCopied defaults to false', () => {
        expect(component.codeCopied()).toBeFalse();
    });

    // ── inputs ────────────────────────────────────────────────────────────────
    it('code input defaults to an empty string', () => {
        expect(component.code()).toBe('');
    });

    it('label input defaults to an empty string', () => {
        expect(component.label()).toBe('');
    });

    it('stageClass input defaults to an empty string', () => {
        expect(component.stageClass()).toBe('');
    });

    // ── onTabChange ───────────────────────────────────────────────────────────
    it('onTabChange() updates the activeTab signal', () => {
        component.onTabChange('code');
        expect(component.activeTab()).toBe('code');
    });

    it('onTabChange() back to preview updates activeTab', () => {
        component.onTabChange('code');
        component.onTabChange('preview');
        expect(component.activeTab()).toBe('preview');
    });

    // ── copy button visibility ────────────────────────────────────────────────
    it('copy button is not rendered on the preview tab', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.pv__copy')).toBeNull();
    });

    it('copy button is rendered after switching to the code tab via DOM click', () => {
        // Click the "Code" tab trigger button inside ZyraTabs
        const tabTriggers = (fixture.nativeElement.querySelectorAll(
            '.zyr-tabs__trigger',
        ) as NodeListOf<HTMLButtonElement>);
        const codeTab = Array.from(tabTriggers).find((b) =>
            b.textContent?.trim().toLowerCase() === 'code',
        );
        codeTab?.click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.pv__copy')).not.toBeNull();
    });

    // ── code display ──────────────────────────────────────────────────────────
    it('displays the code input in the code tab pre element after switching tabs', () => {
        fixture.componentRef.setInput('code', '<zyra-button>Test</zyra-button>');
        fixture.detectChanges();
        const tabTriggers = (fixture.nativeElement.querySelectorAll(
            '.zyr-tabs__trigger',
        ) as NodeListOf<HTMLButtonElement>);
        const codeTab = Array.from(tabTriggers).find((b) =>
            b.textContent?.trim().toLowerCase() === 'code',
        );
        codeTab?.click();
        fixture.detectChanges();
        const pre: HTMLElement = fixture.nativeElement.querySelector('.pv__pre');
        expect(pre).not.toBeNull();
        expect(pre.textContent).toContain('<zyra-button>Test</zyra-button>');
    });

    // ── stageClass ────────────────────────────────────────────────────────────
    it('applies pv__stage--column class when stageClass is "column"', () => {
        fixture.componentRef.setInput('stageClass', 'column');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.pv__stage--column')).not.toBeNull();
    });

    it('applies pv__stage--vertical class when stageClass is "vertical"', () => {
        fixture.componentRef.setInput('stageClass', 'vertical');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.pv__stage--vertical')).not.toBeNull();
    });

    it('applies neither column nor vertical class when stageClass is empty', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.pv__stage--column')).toBeNull();
        expect(fixture.nativeElement.querySelector('.pv__stage--vertical')).toBeNull();
    });

    // ── copy button label ─────────────────────────────────────────────────────
    it('copy button label is "Copy" before copying', () => {
        component.onTabChange('code');
        fixture.detectChanges();
        const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.pv__copy');
        expect(btn.textContent?.trim()).toBe('Copy');
    });
});

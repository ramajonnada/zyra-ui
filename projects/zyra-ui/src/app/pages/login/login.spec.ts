import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Login } from './login';

describe('Login', () => {
    let component: Login;
    let fixture: ComponentFixture<Login>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Login],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ── initial signal state ──────────────────────────────────────────────────
    it('email signal starts empty', () => {
        expect(component.email()).toBe('');
    });

    it('password signal starts empty', () => {
        expect(component.password()).toBe('');
    });

    it('loading signal starts as false', () => {
        expect(component.loading()).toBeFalse();
    });

    // ── onSubmit ──────────────────────────────────────────────────────────────
    it('onSubmit() does nothing when email is empty', () => {
        component.password.set('pass123');
        component.onSubmit();
        expect(component.loading()).toBeFalse();
    });

    it('onSubmit() does nothing when password is empty', () => {
        component.email.set('test@example.com');
        component.onSubmit();
        expect(component.loading()).toBeFalse();
    });

    it('onSubmit() sets loading to true when both email and password are set', () => {
        component.email.set('test@example.com');
        component.password.set('secret');
        component.onSubmit();
        expect(component.loading()).toBeTrue();
    });

    it('onSubmit() resets loading to false after 1500ms', () => {
        jasmine.clock().install();
        component.email.set('test@example.com');
        component.password.set('secret');
        component.onSubmit();
        jasmine.clock().tick(1500);
        expect(component.loading()).toBeFalse();
        jasmine.clock().uninstall();
    });
});

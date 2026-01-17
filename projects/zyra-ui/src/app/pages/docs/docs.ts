import { Component } from '@angular/core';
import { Home } from '../home/home';

@Component({
    selector: 'app-docs',
    imports: [Home],
    templateUrl: './docs.html',
    styleUrl: './docs.scss',
})
export class Docs {}

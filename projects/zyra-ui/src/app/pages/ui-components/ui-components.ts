import { Component } from '@angular/core';
import { Home } from '../home/home';

@Component({
    selector: 'app-ui-components',
    imports: [Home],
    templateUrl: './ui-components.html',
    styleUrl: './ui-components.scss',
})
export class UiComponents {}

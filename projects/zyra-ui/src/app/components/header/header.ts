import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'zyra-ng-ui';

@Component({
	selector: 'app-header',
	imports: [RouterLink, Button],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class Header { }

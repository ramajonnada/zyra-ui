import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZyraFormField, ZyraInput } from 'zyra-ng-ui';
import { CommonModule } from '@angular/common';
// import { ZyraButton, ZyraInput } from 'zyra-ng-ui';
// ZyraButton, ZyraInput,
interface LoginData {
	email: string;
	password: string;
	rememberMe: boolean;
}
@Component({
	selector: 'app-home',
	imports: [ZyraFormField, ZyraInput,ReactiveFormsModule,CommonModule],
	templateUrl: './home.html',
	styleUrl: './home.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
	form = new FormGroup({

		email: new FormControl('', Validators.required)

	});
}

import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
    selector: 'zyra-button',
    imports: [],
    standalone: true,
    templateUrl: './zyra-button.html',
    styleUrl: './zyra-button.css',
})
export class ZyraButton {
    @Input() variant: 'gradient' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' =
        'primary';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input({ transform: booleanAttribute }) disabled = false;
    @Input({ transform: booleanAttribute }) loading = false;
    @Input({ transform: booleanAttribute }) fullWidth = false;
}

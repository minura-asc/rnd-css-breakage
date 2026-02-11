import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-button',
  template: `
    <button [class]="'shared-btn ' + variant">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./shared-button.component.scss']
})
export class SharedButtonComponent {
  @Input() variant: string = 'primary';
}
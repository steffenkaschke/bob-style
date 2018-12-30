import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-back-button',
  template: `
      <button mat-button [disableRipple]="true"
        [ngClass]="type"
        (click)="onClick($event)">
        <ng-content></ng-content>
      </button>
  `,
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {

  constructor() { }
  @Input() type?: ButtonType = ButtonType.secondary;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick($event) {
    this.clicked.emit($event);
  }

}

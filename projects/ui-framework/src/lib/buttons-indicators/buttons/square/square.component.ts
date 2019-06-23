import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType } from '../buttons.enum';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-square-button',
  template: `
    <button
      mat-button
      [disableRipple]="true"
      class="{{ type }}"
      [ngClass]="{ disabled: disabled }"
      (click)="onClick($event)"
    >
      <b-icon
        [icon]="icon"
        [size]="iconSize"
        [color]="disabled ? iconColor.light : color"
      >
      </b-icon>
    </button>
  `,
  styleUrls: ['./square.component.scss']
})
export class SquareButtonComponent {
  @Input() type?: ButtonType = ButtonType.primary;
  @Input() icon: Icons;
  @Input() iconSize: IconSize = IconSize.large;
  @Input() color: IconColor = IconColor.dark;
  @Input() disabled = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  iconColor = IconColor;

  constructor() {}

  onClick($event) {
    this.clicked.emit($event);
  }
}

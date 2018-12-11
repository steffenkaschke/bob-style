import { Component, Input, Output, EventEmitter } from '@angular/core';

export enum ButtonType {
  primary = 'primary',
  secondary = 'secondary',
  tertiary  = 'tertiary'
}

export enum ButtonSize {
  small = 'small',
  medium  = 'medium',
  large  = 'large',
}

@Component({
  selector: 'b-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  constructor() { }
  @Input() type?: ButtonType = ButtonType.primary;
  @Input() size?: ButtonSize = ButtonSize.medium;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  getClassNames() {
    return `${this.type} ${this.size}`;
  }

  onClick($event) {
    this.clicked.emit($event);
  }

}

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-square-button',
  template: `
    <button type="button"
            class="{{ type }} {{ size }}"
            [ngClass]="{ disabled: disabled }"
            (click)="onClick($event)">
      <b-icon [icon]="icon"
              [size]="iconSize"
              [color]="color">
      </b-icon>
    </button>
  `,
  styleUrls: ['./square.component.scss']
})
export class SquareButtonComponent implements OnChanges {
  @Input() type: ButtonType = ButtonType.primary;
  @Input() size: ButtonSize = ButtonSize.medium;
  @Input() icon: Icons;
  @Input() color: IconColor = IconColor.dark;
  @Input() disabled = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  iconSize: IconSize = IconSize.large;

  readonly iconColor = IconColor;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.size) {
      this.iconSize = this.size === ButtonSize.small
        ? IconSize.medium
        : IconSize.large;
    }
  }

  onClick($event) {
    this.clicked.emit($event);
  }
}

import {
  Component,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  HostBinding
} from '@angular/core';
import { ChipType } from '../chip.enum';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';

@Component({
  selector: 'b-chip, [b-chip]',
  template: `
    {{ text }}
    <ng-content></ng-content>

    <b-icon
      *ngIf="removable && type !== chipType.disabled && !disabled"
      class="remove-button"
      [icon]="icon"
      [color]="
        type === chipType.tag || type === chipType.avatar
          ? iconColor.normal
          : iconColor.white
      "
      [hasHoverState]="true"
      [size]="iconSize"
      (click)="onRemoveClick($event)"
    >
    </b-icon>
  `,
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  constructor(public chip: ElementRef) {}

  @Input() type: ChipType = ChipType.tag;
  @Input() text?: string;

  @Input() removable = false;
  @Input() selectable = false;

  @Input() disabled = false;
  @Input() selected = false;

  @Output() removed: EventEmitter<void> = new EventEmitter<void>();

  readonly chipType = ChipType;
  readonly icon = Icons.reset_x;
  public iconColor = IconColor;
  readonly iconSize = IconSize.small;

  @HostBinding('class')
  get chipClass(): string {
    return (
      (this.type !== ChipType.disabled && !this.disabled
        ? 'chip-' + this.type
        : '') +
      (this.selected ? ' chip-selected' : '') +
      (this.disabled || this.type === ChipType.disabled ? ' chip-disabled' : '')
    );
  }

  @HostBinding('tabindex')
  get tabIndex(): string {
    return this.selectable ? '0' : '-1';
  }

  onRemoveClick(event: MouseEvent) {
    event.stopPropagation();
    this.removed.emit();
  }
}

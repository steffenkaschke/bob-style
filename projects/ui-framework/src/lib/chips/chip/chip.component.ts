import {
  Component,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  HostBinding,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ChipType } from '../chips.enum';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';

@Component({
  selector: 'b-chip, [b-chip]',
  template: `
    {{ text }}
    <ng-content></ng-content>

    <b-icon
      *ngIf="removable && !disabled"
      class="remove-button"
      [icon]="icon"
      [color]="
        (type === chipType.tag || type === chipType.avatar) && !selected
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
export class ChipComponent implements OnChanges {
  constructor(public chip: ElementRef) {}

  @Input() text: string;
  @Input() removable = false;

  @HostBinding('attr.data-type') @Input() type: ChipType = ChipType.tag;
  @HostBinding('attr.data-disabled') @Input() disabled = false;
  @HostBinding('attr.data-selected') @Input() selected = false;

  @Output() removed: EventEmitter<void> = new EventEmitter<void>();

  readonly chipType = ChipType;
  readonly icon = Icons.reset_x;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize.small;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.type) {
      this.type = changes.type.currentValue || ChipType.tag;
    }
  }

  onRemoveClick(event: MouseEvent) {
    event.stopPropagation();
    this.removed.emit();
  }
}

import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { ChipType } from '../chips.enum';
import { ColorService } from '../../../services/color-service/color.service';
import { Icons, IconSize, IconColor } from '../../../icons/icons.enum';

@Component({
  selector: 'b-chip, [b-chip]',
  template: `
    <span #chip [ngClass]="class ? class : 'chip-' + type" [ngStyle]="style">
      <ng-content></ng-content>

      <b-icon
        *ngIf="removable && type !== chipType.disabled"
        class="remove-button"
        [ngClass]="{ light: style.color, dark: !style.color }"
        [color]="iconColor"
        [icon]="resetIcon"
        [hasHoverState]="true"
        [size]="iconSize.small"
        (click)="onClick($event)"
      >
      </b-icon>
    </span>
  `,
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent implements OnChanges {
  constructor(private colorService: ColorService) {}

  @Input() type: ChipType = ChipType.default;
  @Input() color?: string;
  @Input() removable = false;
  @Output() removed: EventEmitter<void> = new EventEmitter<void>();

  style = null;
  class = null;
  iconColor = 'transparent';

  readonly chipType = ChipType;
  readonly resetIcon: String = Icons.close;
  readonly iconSize = IconSize;

  @ViewChild('chip', { read: ElementRef }) private chip: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.type || changes.color) {
      this.type =
        (changes.type && changes.type.currentValue) || ChipType.default;
      this.color = changes.color && changes.color.currentValue;

      this.class =
        this.type === ChipType.disabled
          ? 'chip-disabled'
          : !this.color
          ? 'chip-' + this.type
          : 'chip-custom';

      this.style = {
        backgroundColor:
          this.type !== ChipType.disabled && this.color ? this.color : null,
        borderColor:
          this.type !== ChipType.disabled && this.color ? this.color : null
      };

      setTimeout(() => {
        this.style.color =
          this.type !== ChipType.disabled &&
          this.color &&
          this.colorService.isDark(
            getComputedStyle(this.chip.nativeElement).backgroundColor
          )
            ? 'white'
            : null;
        this.iconColor = this.style.color ? IconColor.white : IconColor.dark;
      }, 0);
    }
  }

  onClick(event) {
    event.stopPropagation();
    this.removed.emit();
  }
}

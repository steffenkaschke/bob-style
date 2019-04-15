import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ChipType } from '../chips.enum';
import { ColorService } from '../../../services/color-service/color.service';

@Component({
  selector: 'b-chip, [b-chip]',
  template: `
    <mat-basic-chip
      #chip
      [ngClass]="class"
      [ngStyle]="style"
      [selectable]="false"
      disableRipple="true"
    >
      <ng-content></ng-content>
    </mat-basic-chip>
  `,
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent implements OnChanges {
  constructor(private colorService: ColorService) {}

  @Input() type: ChipType = ChipType.default;
  @Input() color?: string;

  style = null;
  class = null;

  @ViewChild('chip', { read: ElementRef }) private chip: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    this.type = changes.type ? changes.type.currentValue : this.type;
    this.color = changes.color ? changes.color.currentValue : this.color;

    this.class =
      this.type === ChipType.disabled
        ? 'chip-disabled'
        : !this.color
        ? 'chip-' + this.type
        : null;

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
    }, 0);

    console.log(this.class);
  }
}

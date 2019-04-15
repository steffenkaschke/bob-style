import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ChipType } from '../chips.enum';
import { ColorService } from '../../../services/color-service/color.service';

@Component({
  selector: 'b-chip, [b-chip]',
  template: `
    <mat-basic-chip
      #chip
      [ngClass]="
        type === ChipType.disabled
          ? 'chip-disabled'
          : !color
          ? 'chip-' + type
          : null
      "
      [selectable]="false"
      disableRipple="true"
      [ngStyle]="{
        backgroundColor: type !== ChipType.disabled && color,
        borderColor: type !== ChipType.disabled && color,
        color: type !== ChipType.disabled && textColor
      }"
    >
      <ng-content></ng-content>
    </mat-basic-chip>
  `,
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent implements OnInit {
  constructor(private colorService: ColorService) {}

  @Input() type: ChipType = ChipType.default;
  @Input() color?: string;
  ChipType = ChipType;
  textColor = undefined;

  @ViewChild('chip', { read: ElementRef }) private chip: ElementRef;

  ngOnInit() {
    setTimeout(() => {
      this.textColor =
        this.type !== ChipType.disabled &&
        this.color &&
        this.colorService.isDark(
          getComputedStyle(this.chip.nativeElement).backgroundColor
        )
          ? 'white'
          : undefined;
    }, 0);
  }
}

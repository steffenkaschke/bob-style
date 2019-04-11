import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { ChipType } from '../chips.enum';

@Component({
  selector: 'b-chip, [b-chip]',
  template: `
    <mat-basic-chip
      #chip
      [ngClass]="'chip-' + type"
      [selectable]="false"
      disableRipple="true"
      [ngStyle]="{
        backgroundColor: color,
        borderColor: color,
        color: textColor
      }"
    >
      <ng-content></ng-content>
    </mat-basic-chip>
  `,
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent implements AfterViewInit {
  constructor() {}

  @Input() type: ChipType = ChipType.default;
  @Input() color?: string;
  textColor: string;

  @ViewChild('chip') chip: ElementRef;

  getColor(element: ElementRef): number[] {
    const color = getComputedStyle(element.nativeElement).backgroundColor.match(
      /\d+/g
    );
    return color.length > 2
      ? [parseInt(color[0], 10), parseInt(color[1], 10), parseInt(color[2], 10)]
      : null;
  }

  getBrightness(color: number[]): number {
    return !color
      ? null
      : (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
  }

  ngAfterViewInit(): void {
    if (this.color) {
      const color = this.getColor(this.chip);
      const brightness = this.getBrightness(color);
      this.textColor = brightness && brightness < 128 ? 'white' : null;
    }
  }
}

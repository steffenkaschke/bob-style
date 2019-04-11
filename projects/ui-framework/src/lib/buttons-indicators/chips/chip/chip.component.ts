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
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
    );
    return [
      parseInt(color[1], 10),
      parseInt(color[2], 10),
      parseInt(color[3], 10)
    ];
  }

  getBrightness(color: number[]): number {
    return (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
  }

  ngAfterViewInit(): void {
    if (this.color) {
      const color = this.getColor(this.chip);
      this.textColor = this.getBrightness(color) < 128 ? 'white' : 'inherit';
    }
  }
}

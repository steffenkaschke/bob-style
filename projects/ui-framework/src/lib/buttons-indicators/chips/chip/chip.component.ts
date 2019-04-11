import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { ChipType } from '../chips.enum';
import { ColorService } from '../../../services/color-service/color.service';

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
  constructor(private ColorService: ColorService) {}

  @Input() type: ChipType = ChipType.default;
  @Input() color?: string;
  textColor: string;

  @ViewChild('chip') chip: ElementRef;

  ngAfterViewInit(): void {
    this.textColor =
      this.color &&
      this.ColorService.isDark(
        getComputedStyle(this.chip.nativeElement).backgroundColor
      )
        ? 'white'
        : null;
  }
}

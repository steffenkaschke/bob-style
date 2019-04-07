import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Subscription } from 'rxjs';

import { ElementData, Styles } from './truncate-tooltip.interface';
import { truncateCSS, lineClampCSS } from './truncate-tooltip.consts';

@Component({
  selector: 'b-truncate-tooltip, [b-truncate-tooltip]',
  template: `
    <span
      #textContainer
      [matTooltip]="textElementData.text"
      [matTooltipDisabled]="!textElementData.tooltipEnabled"
      matTooltipPosition="above"
      [ngStyle]="textElementData.style"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: []
})
export class TruncateTooltipComponent
  implements OnInit, OnDestroy, AfterViewInit {
  constructor(public utilsService: UtilsService) {}

  @ViewChild('textContainer') textContainer: ElementRef;

  // tslint:disable-next-line:no-input-rename
  @Input('b-truncate-tooltip') maxLines = 1;

  private textElement: HTMLElement;
  private resizeSubscription: Subscription;
  textElementData: ElementData;

  private getLineClampCSS = (): Styles => ({
    ...lineClampCSS,
    maxHeight:
      this.textElementData.fontSize *
        this.textElementData.lineHeight *
        this.maxLines +
      'px',
    webkitLineClamp: this.maxLines
  })

  private applyTextElementStyle() {
    this.textElementData = {
      ...this.textElementData,
      style:
        this.maxLines === 1 || !this.maxLines
          ? truncateCSS
          : this.maxLines > 0
          ? this.getLineClampCSS()
          : null
    };
  }

  private getElementTextData(): void {
    const computedStyle = getComputedStyle(this.textElement);

    this.textElementData = {
      ...this.textElementData,
      fontSize: parseFloat(computedStyle.fontSize),
      lineHeight:
        parseFloat(computedStyle.lineHeight) /
        parseFloat(computedStyle.fontSize),
      text: this.textElement.innerText
    };
  }

  private checkTooltipNecessity(): void {
    this.textElementData = {
      ...this.textElementData,
      tooltipEnabled:
        ((this.maxLines === 1 || !this.maxLines) &&
          this.textElement.scrollWidth > this.textElement.offsetWidth) ||
        (this.maxLines > 0 &&
          this.textElement.scrollHeight > this.textElement.offsetHeight)
          ? true
          : false
    };
  }

  ngOnInit(): void {
    this.textElement = this.textContainer.nativeElement;
    this.getElementTextData();
    this.applyTextElementStyle();

    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .subscribe(() => {
        this.checkTooltipNecessity();
      });

    console.log(this.maxLines);
  }

  ngAfterViewInit(): void {
    this.checkTooltipNecessity();
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}

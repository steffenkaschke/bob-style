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

@Component({
  selector: 'b-truncate-tooltip',
  template: `
    <span
      #textContainer
      [matTooltip]="textElementData.text"
      [matTooltipDisabled]="!textElementData.tooltipEnabled"
      [class]="textElementData.class"
      [ngStyle]="textElementData.style"
      matTooltipPosition="above"
      matTooltipClass="b-truncate-tooltip"
    >
      <ng-content></ng-content>
    </span>
  `,
  styleUrls: ['./truncate-tooltip.component.scss']
})
export class TruncateTooltipComponent
  implements OnInit, OnDestroy, AfterViewInit {
  constructor(public utilsService: UtilsService) {}

  @ViewChild('textContainer') textContainer: ElementRef;

  @Input() maxLines = 1;

  private textElement: HTMLElement;
  private resizeSubscription: Subscription;
  textElementData: ElementData;

  private getLineClampCSS(): Styles {
    return {
      maxHeight:
        this.textElementData.fontSize *
          this.textElementData.lineHeight *
          this.maxLines +
        'px',
      webkitLineClamp: this.maxLines
    };
  }

  private applyTextElementStyle() {
    this.textElementData = {
      ...this.textElementData,
      class:
        this.maxLines === 1 || !this.maxLines
          ? 'truncate'
          : this.maxLines > 1
          ? 'line-clamp'
          : null,
      style: this.maxLines > 1 ? this.getLineClampCSS() : null
    };
  }

  private getElementTextData(): void {
    const computedStyle = getComputedStyle(this.textElement),
      fontSize = parseFloat(computedStyle.fontSize),
      lineHeight =
        computedStyle.lineHeight.indexOf('px') !== -1
          ? parseFloat(computedStyle.lineHeight) / fontSize
          : computedStyle.lineHeight.indexOf('%') !== -1
          ? parseFloat(computedStyle.lineHeight) / 100
          : 1.2;

    this.textElementData = {
      ...this.textElementData,
      fontSize: fontSize,
      lineHeight: lineHeight,
      text: this.textElement.innerText
    };

    // console.log(this.textContainer);
    console.log('textElementData', this.textElementData);
  }

  private checkTooltipNecessity(): void {
    this.textElementData = {
      ...this.textElementData,

      tooltipEnabled:
        ((this.maxLines === 1 || !this.maxLines) &&
          this.textContainer.nativeElement.scrollWidth >
            this.textContainer.nativeElement.offsetWidth) ||
        (this.maxLines > 0 &&
          this.textContainer.nativeElement.scrollHeight >
            this.textContainer.nativeElement.offsetHeight)
          ? true
          : false
    };
  }

  private getDeepestNode(element: HTMLElement): HTMLElement {
    while (element.children.length === 1) {
      element = element.children[0] as HTMLElement;
    }
    return element;
  }

  ngOnInit(): void {
    this.textElement = this.getDeepestNode(this.textContainer.nativeElement);

    console.log('textElement', this.textElement);

    this.getElementTextData();
    this.applyTextElementStyle();

    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .subscribe(() => {
        this.checkTooltipNecessity();
      });
  }

  ngAfterViewInit(): void {
    this.checkTooltipNecessity();
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}

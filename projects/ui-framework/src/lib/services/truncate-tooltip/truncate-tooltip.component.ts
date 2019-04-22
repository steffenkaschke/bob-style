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

import { Styles } from './truncate-tooltip.interface';

@Component({
  selector: 'b-truncate-tooltip',
  template: `
    <span
      #textContainer
      [matTooltip]="tooltipText"
      [matTooltipDisabled]="!tooltipEnabled"
      [ngClass]="textContainerClass"
      [ngStyle]="textContainerStyle"
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

  textContainerClass: string;
  textContainerStyle: Styles;
  tooltipText: string;
  tooltipEnabled = false;

  ngOnInit(): void {
    this.textElement = this.getDeepestNode(this.textContainer.nativeElement);
    this.tooltipText = this.textElement.innerText;

    this.applyTextContainerStyle();

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

  private applyTextContainerStyle(): void {
    const computedStyle = getComputedStyle(this.textElement),
      fontSize = parseFloat(computedStyle.fontSize),
      lineHeight =
        computedStyle.lineHeight.indexOf('px') !== -1
          ? parseFloat(computedStyle.lineHeight) / fontSize
          : computedStyle.lineHeight.indexOf('%') !== -1
          ? parseFloat(computedStyle.lineHeight) / 100
          : 1.2;

    this.textContainerClass =
      this.maxLines === 1
        ? 'truncate'
        : this.maxLines > 1
        ? 'line-clamp'
        : null;

    this.textContainerStyle =
      this.maxLines > 1
        ? {
            maxHeight: fontSize * lineHeight * this.maxLines + 'px',
            webkitLineClamp: this.maxLines
          }
        : null;
  }

  private checkTooltipNecessity(): void {
    this.tooltipEnabled =
      (this.maxLines === 1 &&
        this.textContainer.nativeElement.scrollWidth >
          this.textContainer.nativeElement.offsetWidth) ||
      (this.maxLines > 0 &&
        this.textContainer.nativeElement.scrollHeight >
          this.textContainer.nativeElement.offsetHeight)
        ? true
        : false;
  }

  private getDeepestNode(element: HTMLElement): HTMLElement {
    while (element.children.length === 1) {
      element = element.children[0] as HTMLElement;
    }
    return element;
  }
}

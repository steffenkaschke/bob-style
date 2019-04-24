import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewContainerRef,
  AfterContentChecked
} from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Subscription } from 'rxjs';
import { Styles } from './truncate-tooltip.interface';

@Component({
  selector: 'b-truncate-tooltip, [b-truncate-tooltip]',
  template: `
    <span
      #textContainer
      class="btt"
      [matTooltip]="tooltipText"
      [matTooltipDisabled]="!tooltipEnabled"
      [ngClass]="textContainerClass"
      [ngStyle]="textContainerStyle"
      matTooltipPosition="above"
      matTooltipClass="b-truncate-tooltip"
    >
      <ng-content></ng-content>
      <ng-template #directiveTemplate></ng-template>
    </span>
  `,
  styleUrls: ['./truncate-tooltip.component.scss']
})
export class TruncateTooltipComponent
  implements AfterViewInit, AfterContentChecked, OnDestroy {
  constructor(public utilsService: UtilsService) {}

  @ViewChild('textContainer') textContainer: ElementRef;
  @ViewChild('directiveTemplate', { read: ViewContainerRef })
  child: ViewContainerRef;

  maxLines = 1;

  @Input('maxLines')
  set lines(value: number | string) {
    this.setMaxLines(value);
  }

  @Input('b-truncate-tooltip')
  set linesAlt(value: number | string) {
    this.setMaxLines(value);
  }

  private textElement: HTMLElement;
  private resizeSubscription: Subscription;

  textContainerClass: string;
  textContainerStyle: Styles;
  tooltipText: string;
  tooltipEnabled = false;

  ngAfterViewInit(): void {
    this.textElement = this.getDeepestNode(this.textContainer.nativeElement);
    this.tooltipText = this.textElement.innerText;

    this.applyTextContainerStyle();

    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .subscribe(() => {
        this.checkTooltipNecessity();
      });

    setTimeout(() => {
      this.checkTooltipNecessity();
    }, 0);
  }

  ngAfterContentChecked(): void {
    if (this.textElement && this.tooltipText !== this.textElement.innerText) {
      this.tooltipText = this.textElement.innerText;
      this.checkTooltipNecessity();
    }
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
        ? 'btt-truncate'
        : this.maxLines > 1
        ? 'btt-line-clamp'
        : null;

    this.textContainerStyle =
      this.maxLines > 1
        ? {
            maxHeight: fontSize * lineHeight * this.maxLines + 'px',
            webkitLineClamp: this.maxLines
          }
        : null;

    this.setCssProps(this.textContainer.nativeElement, {
      '--btt-line-height': lineHeight,
      '--btt-font-size': fontSize + 'px'
    });
  }

  private checkTooltipNecessity(): void {
    this.tooltipEnabled =
      (this.maxLines === 1 &&
        this.textElement.scrollWidth > this.textElement.offsetWidth) ||
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

  private setCssProps(element: HTMLElement, props: object): void {
    for (const prop of Object.keys(props)) {
      element.style.setProperty(prop, props[prop]);
    }
  }

  private setMaxLines(value: number | string) {
    if (value) {
      this.maxLines = parseInt(value as string, 10);
    }
  }
}

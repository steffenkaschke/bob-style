import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewContainerRef,
  DoCheck,
  HostBinding
} from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Subscription } from 'rxjs';
import {
  Styles,
  TextProps,
  NotEmptyChildren
} from './truncate-tooltip.interface';

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
  implements AfterViewInit, DoCheck, OnDestroy {
  constructor(public utilsService: UtilsService) {}

  private textContainer: HTMLElement;
  private maxLinesDefault = 1;
  private maxLinesCache = this.maxLinesDefault;
  private maxLines = this.maxLinesDefault;
  private textElement: HTMLElement;
  private textElementTextProps: TextProps;
  private resizeSubscription: Subscription;
  textContainerClass: string;
  textContainerStyle: Styles;
  tooltipText: string;
  tooltipEnabled = false;

  @ViewChild('textContainer')
  set container(element: ElementRef) {
    this.textContainer = element.nativeElement;
  }
  @ViewChild('directiveTemplate', { read: ViewContainerRef })
  child: ViewContainerRef;

  @Input('maxLines')
  set lines(value: number | string) {
    this.setMaxLines(value);
  }
  @Input('b-truncate-tooltip')
  set linesAlt(value: number | string) {
    this.setMaxLines(value);
  }

  @HostBinding('class.btt-initialized') initialized: boolean;

  ngAfterViewInit(): void {
    this.maxLinesCache = this.maxLines;
    this.textElement = this.getDeepTextElement(this.textContainer);

    setTimeout(() => {
      this.tooltipText = this.textElement.innerText;
      this.applyTextContainerStyle();
    }, 0);

    setTimeout(() => {
      this.checkTooltipNecessity();
      this.initialized = true;
    }, 0);

    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .subscribe(() => {
        this.checkTooltipNecessity();
      });
  }

  ngDoCheck(): void {
    if (this.initialized && this.tooltipText !== this.textElement.innerText) {
      this.tooltipText = this.textElement.innerText;
      this.checkTooltipNecessity();
    }

    if (this.initialized && this.maxLines !== this.maxLinesCache) {
      this.setMaxLines(this.maxLines);
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  private getElementTextProps(element: HTMLElement): TextProps {
    const computedStyle = getComputedStyle(element),
      fontSize = parseFloat(computedStyle.fontSize),
      lineHeight =
        computedStyle.lineHeight.indexOf('px') !== -1
          ? parseFloat(computedStyle.lineHeight) / fontSize
          : computedStyle.lineHeight.indexOf('%') !== -1
          ? parseFloat(computedStyle.lineHeight) / 100
          : 1.2;
    return {
      fontSize: fontSize,
      lineHeight: lineHeight
    };
  }

  private applyTextContainerStyle(): void {
    if (!this.textElementTextProps) {
      this.textElementTextProps = this.getElementTextProps(this.textElement);

      this.setCssProps(this.textContainer, {
        '--btt-line-height': this.textElementTextProps.lineHeight,
        '--btt-font-size': this.textElementTextProps.fontSize + 'px'
      });
    }

    this.textContainerClass =
      this.maxLines === 1
        ? 'btt-truncate'
        : this.maxLines > 1
        ? 'btt-line-clamp'
        : null;

    this.textContainerStyle =
      this.maxLines > 1
        ? {
            maxHeight:
              this.textElementTextProps.fontSize *
                this.textElementTextProps.lineHeight *
                this.maxLines +
              'px',
            webkitLineClamp: this.maxLines
          }
        : null;
  }

  private checkTooltipNecessity(): void {
    this.tooltipEnabled =
      (this.maxLines === 1 &&
        this.textContainer.scrollWidth > this.textContainer.offsetWidth) ||
      (this.maxLines > 0 &&
        this.textContainer.scrollHeight > this.textContainer.offsetHeight)
        ? true
        : false;
  }

  private hasNotEmptyChildren(element: HTMLElement): NotEmptyChildren {
    return Array.from(element.children).reduce(
      (acc, node, index) => {
        const hasText = !!(node as HTMLElement).innerText;
        return {
          total: hasText ? acc.total + 1 : acc.total,
          firstIndex:
            hasText && acc.firstIndex === null ? index : acc.firstIndex
        };
      },
      { total: 0, firstIndex: null }
    );
  }

  private hasTextNodes(element: HTMLElement): boolean {
    return !!Array.from(element.childNodes).find(
      node => node.nodeType === Node.TEXT_NODE
    );
  }

  private getDeepTextElement(element: HTMLElement): HTMLElement {
    while (
      this.hasNotEmptyChildren(element).total === 1 &&
      !this.hasTextNodes(element)
    ) {
      element = element.children[
        this.hasNotEmptyChildren(element).firstIndex
      ] as HTMLElement;
    }
    return element;
  }

  private setCssProps(element: HTMLElement, props: object): void {
    for (const prop of Object.keys(props)) {
      element.style.setProperty(prop, props[prop]);
    }
  }

  private parseMaxLines(value: string | number): number {
    value = parseInt(value as string, 10);
    return value === value ? value : this.maxLinesDefault;
  }

  private setMaxLines(value: number | string): void {
    value = this.parseMaxLines(value);
    this.maxLines = value;

    if (value !== this.maxLinesCache && this.initialized) {
      this.applyTextContainerStyle();
      setTimeout(() => {
        this.checkTooltipNecessity();
      }, 0);
    }

    this.maxLinesCache = this.maxLines;
  }
}

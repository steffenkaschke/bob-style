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
import { DOMhelpers, TextProps, Styles } from '../utils/dom-helpers.service';

@Component({
  selector: 'b-truncate-tooltip, [b-truncate-tooltip]',
  template: `
    <span
      #textContainer
      class="btt"
      [ngClass]="textContainerClass"
      [ngStyle]="textContainerStyle"
      [matTooltip]="tooltipText"
      [matTooltipDisabled]="!tooltipEnabled"
      [matTooltipShowDelay]="delay"
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
  @Input() delay = 300;

  @HostBinding('class.btt-initialized') initialized: boolean;

  constructor(private utilsService: UtilsService, private DOM: DOMhelpers) {}

  ngAfterViewInit(): void {
    this.maxLinesCache = this.maxLines;
    this.textElement = this.DOM.getDeepTextElement(this.textContainer);

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

  private applyTextContainerStyle(): void {
    if (!this.textElementTextProps) {
      this.textElementTextProps = this.DOM.getElementTextProps(
        this.textElement
      );

      this.DOM.setCssProps(this.textContainer, {
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

  private parseMaxLines(value: string | number): number {
    value = parseInt(value as string, 10);
    return value === value ? value : this.maxLinesDefault;
  }

  private setMaxLines(value: number | string): void {
    this.maxLines = this.parseMaxLines(value);

    if (this.maxLines !== this.maxLinesCache && this.initialized) {
      this.applyTextContainerStyle();
      setTimeout(() => {
        this.checkTooltipNecessity();
      }, 0);
    }

    this.maxLinesCache = this.maxLines;
  }
}

import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewContainerRef,
  DoCheck
} from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Subscription } from 'rxjs';
import { DOMhelpers, TextProps } from '../utils/dom-helpers.service';

@Component({
  selector: 'b-truncate-tooltip, [b-truncate-tooltip]',
  template: `
    <span
      #textContainer
      class="btt"
      [ngClass]="{ initialized: initialized }"
      [attr.data-max-lines]="maxLines"
      [matTooltip]="tooltipText"
      [matTooltipDisabled]="!initialized || !tooltipEnabled"
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
  constructor(private utilsService: UtilsService, private DOM: DOMhelpers) {}

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
  @Input() expectChanges = true;
  @Input() trustCssVars = false;

  private resizeSubscription: Subscription;
  private textContainer: HTMLElement;
  private textElementTextProps: TextProps;
  private maxLinesDefault = 1;
  private maxLinesCache = this.maxLinesDefault;
  public maxLines = this.maxLinesDefault;
  public tooltipText: string;
  public tooltipEnabled = false;
  public initialized = this.trustCssVars;

  ngAfterViewInit(): void {
    this.maxLinesCache = this.maxLines;

    setTimeout(() => {
      this.tooltipText = this.textContainer.innerText;
      this.setCssVars();
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
    if (this.expectChanges) {
      if (
        this.initialized &&
        this.tooltipText !== this.textContainer.innerText
      ) {
        this.tooltipText = this.textContainer.innerText;
        this.checkTooltipNecessity();
      }

      if (this.initialized && this.maxLines !== this.maxLinesCache) {
        this.setMaxLines(this.maxLines);
      }
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  private setCssVars(): void {
    if (!this.textElementTextProps && !this.trustCssVars) {
      this.textElementTextProps = this.DOM.getElementTextProps(
        this.DOM.getDeepTextElement(this.textContainer)
      );
      this.textElementTextProps.maxHeight =
        this.textElementTextProps.fontSize *
        this.textElementTextProps.lineHeight *
        this.maxLines;

      this.DOM.setCssProps(this.textContainer, {
        '--line-height': this.textElementTextProps.lineHeight,
        '--font-size': this.textElementTextProps.fontSize + 'px',
        'max-height': this.textElementTextProps.maxHeight + 'px'
      });
    }
  }

  private checkTooltipNecessity(): void {
    this.tooltipEnabled =
      (this.maxLines === 1 &&
        this.textContainer.scrollWidth > this.textContainer.offsetWidth) ||
      (this.maxLines > 1 &&
        this.textContainer.scrollHeight >
          (this.trustCssVars
            ? this.textContainer.offsetHeight + 5
            : this.textElementTextProps.maxHeight))
        ? true
        : false;
  }

  private parseMaxLines(value: string | number): number {
    value = parseInt(value as string, 10);
    return value === value ? value : this.maxLinesDefault;
  }

  private setMaxLines(value: number | string): void {
    this.maxLines = this.parseMaxLines(value);
    if (
      this.maxLines !== this.maxLinesCache &&
      this.initialized &&
      this.expectChanges
    ) {
      setTimeout(() => {
        this.checkTooltipNecessity();
      }, 0);
    }
    this.maxLinesCache = this.maxLines;
  }
}

import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewContainerRef,
  DoCheck,
  HostListener
} from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Subscription } from 'rxjs';
import { DOMhelpers, TextProps } from '../utils/dom-helpers.service';
import { TruncateTooltiptype } from './truncate-tooltip.enum';

@Component({
  selector: 'b-truncate-tooltip, [b-truncate-tooltip]',
  template: `
    <i
      class="tooltip-trigger"
      *ngIf="tooltipAllowed && tooltipEnabled"
      [matTooltip]="tooltipText"
      [matTooltipShowDelay]="delay"
      matTooltipPosition="above"
      matTooltipClass="b-truncate-tooltip"
    ></i>
    <span
      #textContainer
      class="btt"
      [ngClass]="{ initialized: initialized }"
      [attr.data-max-lines]="maxLines"
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
  @Input() expectChanges = false;
  @Input() trustCssVars = false;
  @Input() type: TruncateTooltiptype = TruncateTooltiptype.lazy;

  private resizeSubscription: Subscription;
  private textContainer: HTMLElement;
  private textElementTextProps: TextProps;
  private maxLinesDefault = 1;
  private maxLinesCache = this.maxLinesDefault;
  public maxLines = this.maxLinesDefault;
  public tooltipText: string;
  public tooltipEnabled = false;
  public tooltipAllowed = false;
  public initialized = this.trustCssVars;
  private hoverTimer;

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.type === TruncateTooltiptype.lazy && !this.tooltipAllowed) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = setTimeout(() => {
        this.tooltipAllowed = true;
      }, 200);
    }
  }
  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }
  }

  ngAfterViewInit(): void {
    this.maxLinesCache = this.maxLines;

    setTimeout(() => {
      this.tooltipText = this.textContainer.innerText;
      this.setCssVars();
    }, 0);

    setTimeout(() => {
      this.checkTooltipNecessity();
      this.initialized = true;
      if (this.type !== TruncateTooltiptype.lazy) {
        this.tooltipAllowed = true;
      }
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
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }
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

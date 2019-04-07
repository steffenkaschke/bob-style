import {
  Component,
  Directive,
  OnInit,
  Input,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewRef,
  EmbeddedViewRef,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Subscription } from 'rxjs';
import { MatTooltip } from '@angular/material';

interface ElementData {
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  contentWidth?: number;
  contentHeight?: number;
  scrollWidth?: number;
  scrollHeight?: number;
  tooltipEnabled?: boolean;
}

interface Styles {
  [key: string]: string | number;
}

const commonCSS: Styles = {
  border: '0',
  padding: '0',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const truncateCSS: Styles = {
  ...commonCSS,
  display: 'block',
  whiteSpace: 'nowrap'
};

@Component({
  selector: '[bTruncateTooltip]',
  template: `
    <span
      #textElement
      [matTooltip]="textElementData.text"
      [matTooltipDisabled]="tooltipEnabled"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: []
})
export class TruncateTooltipComponent implements OnInit, OnDestroy {
  constructor(public utilsService: UtilsService) {}

  @ViewChild('textElement') textContainer: ElementRef;

  private textElement: HTMLElement;

  @Input('bTruncateTooltip') maxLines: number;

  private resizeSubscription: Subscription;
  // private textContainer: EmbeddedViewRef<any>;
  // private textElement: HTMLElement;
  textElementData: ElementData;

  tooltipEnabled = false;
  tooltipExists = false;

  private getLineClampCSS = (): Styles => ({
    ...commonCSS,
    display: '-webkit-box',
    webkitBoxOrient: 'vertical',
    maxHeight:
      this.textElementData.fontSize *
        this.textElementData.lineHeight *
        this.maxLines +
      'px',
    webkitLineClamp: this.maxLines
  })

  private setElementStyle(style: Styles): void {
    Object.keys(style).forEach(prop => {
      this.textElement.style[prop] = style[prop];
    });
  }

  private applyTextElementStyle() {
    if (this.maxLines === 1) {
      this.setElementStyle(truncateCSS);
    } else if (this.maxLines > 0) {
      this.setElementStyle(this.getLineClampCSS());
    }
  }

  private getElementTextData(): ElementData {
    return {
      fontSize: parseFloat(getComputedStyle(this.textElement).fontSize),
      lineHeight:
        parseFloat(getComputedStyle(this.textElement).lineHeight) /
        parseFloat(getComputedStyle(this.textElement).fontSize),
      text: this.textElement.innerText
    };
  }

  private getElementDimentions(): ElementData {
    return {
      contentWidth: this.textElement.offsetWidth,
      contentHeight: this.textElement.offsetHeight,
      scrollWidth: this.textElement.scrollWidth,
      scrollHeight: this.textElement.scrollHeight,
      tooltipEnabled:
        this.textElement.scrollHeight > this.textElement.offsetHeight
          ? true
          : false
    };
  }

  private initTextElementData(): void {
    this.textElementData = this.getElementTextData();
  }

  private updateElementData(): void {
    const newDimentions = this.getElementDimentions();

    this.textElementData = {
      ...this.textElementData,
      ...newDimentions
    };
  }

  private checkTooltipNecessity(): void {
    this.updateElementData();

    this.tooltipEnabled =
      this.textElementData.scrollHeight > this.textElementData.contentHeight
        ? true
        : false;

    if (this.tooltipEnabled) {
      console.log('tooltip is needed');
    }

    console.log(this.textElementData);

    // if (this.isBusy) {
    //   const cmpFactory = this.cfr.resolveComponentFactory(SpinnerComponent);
    //   this.vcr.createComponent(cmpFactory);
    // }
  }

  ngOnInit(): void {
    // this.textContainer = this.vcr.createEmbeddedView(this.templateRef);
    // this.textElement = this.textContainer.rootNodes[0];

    this.textElement = this.textContainer.nativeElement;

    this.initTextElementData();
    this.applyTextElementStyle();
    this.checkTooltipNecessity();

    this.resizeSubscription = this.utilsService
      .getResizeEvent()
      .subscribe(() => {
        this.checkTooltipNecessity();
      });
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}

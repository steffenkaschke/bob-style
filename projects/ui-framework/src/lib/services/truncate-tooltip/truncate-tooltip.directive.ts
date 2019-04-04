import {
  Directive,
  OnInit,
  Input,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewRef,
  EmbeddedViewRef,
  OnDestroy
} from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Subscription } from 'rxjs';

interface ElementData {
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  contentWidth?: number;
  contentHeight?: number;
  scrollWidth?: number;
  scrollHeight?: number;
  tooltipIsNeeded?: boolean;
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

@Directive({
  selector: '[bTruncateTooltip]'
})
export class TruncateTooltipDirective implements OnInit, OnDestroy {
  constructor(
    public utilsService: UtilsService,
    private templateRef: TemplateRef<void>,
    private vcr: ViewContainerRef,
    private cfr: ComponentFactoryResolver
  ) {}

  @Input('bTruncateTooltip') maxLines: number;

  private resizeSubscription: Subscription;
  private textContainer: EmbeddedViewRef<any>;
  private textElement: HTMLElement;
  private textElementData: ElementData;

  tooltipIsNeeded = false;
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
      tooltipIsNeeded:
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

    this.tooltipIsNeeded =
      this.textElementData.scrollHeight > this.textElementData.contentHeight
        ? true
        : false;

    if (this.tooltipIsNeeded) {
      console.log('tooltip is needed');
    }

    console.log(this.textElementData);

    // if (this.isBusy) {
    //   const cmpFactory = this.cfr.resolveComponentFactory(SpinnerComponent);
    //   this.vcr.createComponent(cmpFactory);
    // }
  }

  ngOnInit(): void {
    this.textContainer = this.vcr.createEmbeddedView(this.templateRef);
    this.textElement = this.textContainer.rootNodes[0];

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

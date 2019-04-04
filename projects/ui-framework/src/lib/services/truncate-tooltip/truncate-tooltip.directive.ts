import {
  Directive,
  OnInit,
  Input,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewRef,
  EmbeddedViewRef
} from '@angular/core';

@Directive({
  selector: '[b-truncate-tooltip]'
})
export class TruncateTooltipDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<void>,
    private vcr: ViewContainerRef,
    private cfr: ComponentFactoryResolver
  ) {}

  @Input('b-truncate-tooltip') maxLines: number;

  private textContainer: EmbeddedViewRef<any>;
  private textElement: HTMLElement;
  private textElementData: any;

  private truncateCSS = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  private getLineClampCSS = () => ({
    paddingTop: '0',
    paddingBottom: '0',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight:
      this.textElementData.fontSize *
        this.textElementData.lineHeight *
        this.maxLines +
      'px',
    webkitLineClamp: this.maxLines
  })

  private setElementStyle(style: object): void {
    Object.keys(style).forEach(prop => {
      this.textElement.style[prop] = style[prop];
    });
  }

  private getElementTextData(element: HTMLElement) {
    return {
      fontSize: parseFloat(getComputedStyle(element).fontSize),
      lineHeight:
        parseFloat(getComputedStyle(element).lineHeight) /
        parseFloat(getComputedStyle(element).fontSize),
      text: element.innerText
    };
  }

  private getElementDimentions(element: HTMLElement) {
    const cs = getComputedStyle(element);
    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const borderX =
      parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const borderY =
      parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const boxModel = cs.boxSizing;

    return {
      contentWidth: element.offsetWidth - paddingX - borderX,
      contentHheight: element.offsetHeight - paddingY - borderY,
      paddingX: paddingX,
      paddingY: paddingY,
      borderBox: boxModel === 'border-box' ? true : false
    };
  }

  ngOnInit() {
    this.textContainer = this.vcr.createEmbeddedView(this.templateRef);
    this.textElement = this.textContainer.rootNodes[0];

    this.textElementData = {
      ...this.getElementTextData(this.textElement),
      ...this.getElementDimentions(this.textElement)
    };

    console.log(this.textElementData);

    this.setElementStyle(this.getLineClampCSS());

    // if (this.isBusy) {
    //   const cmpFactory = this.cfr.resolveComponentFactory(SpinnerComponent);
    //   this.vcr.createComponent(cmpFactory);
    // }
  }
}

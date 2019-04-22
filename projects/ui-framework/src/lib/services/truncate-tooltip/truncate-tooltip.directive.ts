import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  Input,
  OnDestroy,
  ComponentRef
} from '@angular/core';

import { TruncateTooltipComponent } from './truncate-tooltip.component';

@Directive({
  selector: '[bTruncateTooltip]'
})
export class TruncateTooltipDirective implements OnInit, OnDestroy {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  private tooltipComponent: ComponentRef<any>;

  @Input() bTruncateTooltip = 1;

  ngOnInit(): void {
    const templateView = this.templateRef.createEmbeddedView({});
    const compFactory = this.resolver.resolveComponentFactory(
      TruncateTooltipComponent
    );
    this.tooltipComponent = this.viewContainer.createComponent(
      compFactory,
      null,
      this.viewContainer.injector,
      [templateView.rootNodes]
    );
    this.tooltipComponent.instance.maxLines = this.bTruncateTooltip;
  }

  ngOnDestroy(): void {
    this.tooltipComponent.destroy();
    this.tooltipComponent = null;
  }
}

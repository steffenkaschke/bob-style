import { Directive, TemplateRef, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';

import { TruncateTooltipComponent } from './truncate-tooltip.component';

@Directive({
  selector: '[bTruncateTooltip]'
})
export class TruncateTooltipDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    const templateView = this.templateRef.createEmbeddedView({});
    const compFactory = this.resolver.resolveComponentFactory(
      TruncateTooltipComponent
    );
    this.viewContainer.createComponent(
      compFactory,
      null,
      this.viewContainer.injector,
      [templateView.rootNodes]
    );
  }
}

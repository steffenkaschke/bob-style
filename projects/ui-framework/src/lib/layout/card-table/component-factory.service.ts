import {
  Injectable,
  Inject,
  ComponentFactoryResolver,
  ViewContainerRef,
  Type,
  ComponentRef,
  EventEmitter,
  Injector,
  ComponentFactory
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import {
  CardTableCellComponent,
  CardTableCellComponentContent,
  CardTableCellComponentHandlersObj
} from './card-table.interface';

@Injectable()
export class ComponentFactoryService {
  container: ViewContainerRef;
  component: ComponentRef<any>;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {}

  setComponentContainerRef(view: ViewContainerRef): void {
    this.container = view;
  }

  private resolveFactory(component: Type<any>): ComponentFactory<any> {
    return this.factoryResolver.resolveComponentFactory(component);
  }

  private resolveNgContent(content: CardTableCellComponentContent): any[] {
    if (!Array.isArray(content)) {
      content = [content];
    }
    const elements = content.map(cntnt => {
      if (typeof cntnt === 'string') {
        return [this.document.createTextNode(cntnt)];
      }
      if (!!cntnt.component) {
        const transcomponent = this.createComponent(cntnt, false);
        return [transcomponent.location.nativeElement];
      }
    });
    return [...elements];
  }

  private resolveComponentAttributes(
    component: ComponentRef<any>,
    attributes: object
  ): ComponentRef<any> {
    for (const attr of Object.keys(attributes)) {
      component.instance[attr] = attributes[attr];
    }
    return component;
  }

  private resolveComponentHandlers(
    component: ComponentRef<any>,
    handlers: CardTableCellComponentHandlersObj
  ): ComponentRef<any> {
    for (const handler of Object.keys(handlers)) {
      component.instance[handler].subscribe((event: EventEmitter<any>) =>
        handlers[handler](event)
      );
    }
    return component;
  }

  createComponent(
    comp: CardTableCellComponent,
    attach = false
  ): ComponentRef<any> {
    let component: ComponentRef<any>;

    const factory = this.resolveFactory(comp.component);

    const ngContent = comp.content
      ? this.resolveNgContent(comp.content)
      : undefined;

    if (attach) {
      component = this.container.createComponent(
        factory,
        undefined,
        undefined,
        ngContent
      );
    } else {
      component = factory.create(this.injector, ngContent);
    }

    if (comp.attributes) {
      this.resolveComponentAttributes(component, comp.attributes);
    }

    if (comp.handlers) {
      this.resolveComponentHandlers(component, comp.handlers);
    }

    if (!attach) {
      component.hostView.detectChanges();
    }

    return component;
  }

  insertComponent(comp: CardTableCellComponent): void {
    this.reset();
    this.component = this.createComponent(comp, true);
  }

  reset(): void {
    this.container.clear();
  }

  destroyComponent(): void {
    this.component.destroy();
    this.component = null;
  }
}

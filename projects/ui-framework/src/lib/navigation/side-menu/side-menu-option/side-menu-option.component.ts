import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { SideMenuOption } from './side-menu-option.interface';
import merge from 'lodash/merge';
import isUndefined from 'lodash/isUndefined';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-side-menu-option',
  templateUrl: './side-menu-option.component.html',
  styleUrls: ['./side-menu-option.component.scss']
})
export class SideMenuOptionComponent implements OnInit, OnChanges {
  @Input() option: SideMenuOption;
  @Input() selected: boolean;
  @Output() selectOption: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('prefix', { read: ViewContainerRef }) private prefix: ViewContainerRef;
  @ViewChild('postfix', { read: ViewContainerRef }) postfix: ViewContainerRef;

  private prefixComponent: any;

  public icons = Icons;
  public colors = IconColor;
  public sizes = IconSize;

  public showActions = false;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.renderComponent();
  }

  ngOnChanges() {
    this.renderComponent();
  }

  private renderComponent(): void {
    if (isUndefined(this.prefixComponent)) {
      this.createComponent();
    }

    this.updateAttrs();
  }

  private createComponent() {
    const component = this.option.prefix.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.prefix;
    viewContainerRef.clear();
    this.prefixComponent = viewContainerRef.createComponent(componentFactory);
  }

  private updateAttrs() {
    const instance = this.prefixComponent.instance as any;
    const attrs = this.option.prefix.attributes;
    merge(instance, attrs);
  }

  onSelectOption(): void {
    this.selectOption.emit(this.option.id);
  }

  stopBubbling($event): void {
    $event.stopPropagation();
  }

  setShowActions(status: boolean): void {
    setTimeout(() => this.showActions = status);
  }

  onActionClick(): void {
    this.setShowActions(false);
  }
}

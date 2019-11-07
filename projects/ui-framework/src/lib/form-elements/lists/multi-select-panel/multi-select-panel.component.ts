import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  ViewContainerRef
} from '@angular/core';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { ListFooterActions } from '../list.interface';
import { ListChange } from '../list-change/list-change';
import { LIST_EL_HEIGHT } from '../list.consts';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'b-multi-select-panel',
  templateUrl: './multi-select-panel.component.html',
  styleUrls: [
    '../list-panel.scss',
    '../multi-select/multi-select.component.scss'
  ]
})
export class MultiSelectPanelComponent extends BaseSelectPanelElement {
  @Input() chevronButtonText: string;

  listChange: ListChange;

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly listActions: ListFooterActions = {
    clear: true,
    apply: true,
    cancel: true
  };
  panelClassList: string[] = ['b-select-panel-with-arrow'];

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef
  ) {
    super(
      overlay,
      viewContainerRef,
      panelPositionService,
      utilsService,
      DOM,
      zone,
      cd
    );
    this.wrapEvent = false;
    this.doPropagate = false;
  }

  onSelect(listChange: ListChange): void {
    this.listChange = listChange;
  }

  onCancel(): void {
    this.destroyPanel();
  }

  onApply(): void {
    this.options = this.listChange.getSelectGroupOptions();
    this.selectChange.emit(this.listChange);
    this.destroyPanel();
  }
}

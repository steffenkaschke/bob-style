import {
  Component,
  Renderer2,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { ListHeader } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  arrayDifference,
  joinArrays,
} from '../../services/utils/functional-utils';
import { SelectType } from '../list.enum';
import { MobileService } from '../../services/utils/mobile.service';
import { MULTI_LIST_LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';
import { LIST_EL_HEIGHT } from '../list.consts';
import { FORM_ELEMENT_HEIGHT } from '../../form-elements/form-elements.const';

@Component({
  selector: 'b-multi-list',
  templateUrl: 'multi-list.component.html',
  styleUrls: [
    '../single-list/single-list.component.scss',
    'multi-list.component.scss',
  ],
})
export class MultiListComponent extends BaseListElement {
  constructor(
    renderer: Renderer2,
    keybrdSrvc: ListKeyboardService,
    modelSrvc: ListModelService,
    listChangeSrvc: ListChangeService,
    mobileService: MobileService,
    cd: ChangeDetectorRef,
    zone: NgZone,
    DOM: DOMhelpers,
    host: ElementRef
  ) {
    super(
      renderer,
      keybrdSrvc,
      modelSrvc,
      listChangeSrvc,
      mobileService,
      cd,
      zone,
      DOM,
      host
    );
    this.type = SelectType.multi;
    this.listActions = { ...MULTI_LIST_LIST_ACTIONS_DEF };
  }

  headerClick(header: ListHeader): void {
    if (header.groupIsOption) {
      super.headerClick(header);
      return;
    }

    if (this.options.length > 1 && !header.groupIsOption) {
      this.toggleGroupCollapse(header);
    } else if (!this.readonly) {
      this.selectGroup(header);
    }
  }

  selectGroup(header: ListHeader): void {
    if (header.groupIsOption) {
      super.headerClick(header);
      return;
    }

    const groupOptions = this.options[header.groupIndex].options;

    header.selected = groupOptions
      .filter((option) => !(option.disabled && !option.selected))
      .some((option) => !option.selected);

    const groupOptionsNotDisabledIDs = groupOptions
      .filter((option) => !option.disabled)
      .map((option) => option.id);

    const groupOptionsSelectedDisabledIDs = this.getSelectedIDs(
      this.options,
      'disabled'
    );

    this.selectedIDs = header.selected
      ? joinArrays(
          this.selectedIDs,
          groupOptionsNotDisabledIDs,
          groupOptionsSelectedDisabledIDs
        )
      : joinArrays(
          arrayDifference(this.selectedIDs, groupOptionsNotDisabledIDs),
          groupOptionsSelectedDisabledIDs
        );

    this.emitChange();
    this.updateActionButtonsState();

    this.updateLists({
      updateListHeaders: false,
      updateListOptions: false,
      selectedIDs: this.selectedIDs,
    });
  }

  getListHeight(): number {
    return this.listOptions?.length
      ? this.listOptions.length *
          (FORM_ELEMENT_HEIGHT[this.size] || LIST_EL_HEIGHT)
      : null;
  }
}

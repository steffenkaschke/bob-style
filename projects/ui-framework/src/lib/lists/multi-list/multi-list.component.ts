import {
  Component,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { cloneDeep, chain, isEqual } from 'lodash';
import { ListHeader, ListOption, SelectGroupOption } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListChange } from '../list-change/list-change';
import { hasChanges } from '../../services/utils/functional-utils';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { simpleChange } from '../../services/utils/test-helpers';

@Component({
  selector: 'b-multi-list',
  templateUrl: 'multi-list.component.html',
  styleUrls: [
    '../single-list/single-list.component.scss',
    'multi-list.component.scss',
  ],
})
export class MultiListComponent extends BaseListElement implements OnChanges {
  constructor(
    renderer: Renderer2,
    listKeyboardService: ListKeyboardService,
    listModelService: ListModelService,
    listChangeService: ListChangeService,
    cd: ChangeDetectorRef,
    zone: NgZone,
    DOM: DOMhelpers,
    host: ElementRef
  ) {
    super(
      renderer,
      listKeyboardService,
      listModelService,
      listChangeService,
      cd,
      zone,
      DOM,
      host
    );
    this.listActions = {
      clear: true,
      reset: false,
      apply: false,
    };
  }

  public selectedIDs: (string | number)[];

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (hasChanges(changes, ['options', 'showSingleGroupHeader'])) {
      this.selectedIDs = this.getSelectedIDs(this.options);
    }

    if (
      hasChanges(changes, [
        'options',
        'showSingleGroupHeader',
        'optionsDefault',
      ])
    ) {
      this.updateActionButtonsState();
    }
  }

  headerClick(header: ListHeader): void {
    if (this.options.length > 1) {
      this.toggleGroupCollapse(header);
    } else {
      this.headerSelect(header);
    }
  }

  toggleGroupCollapse(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;

    this.updateLists({
      updateListHeaders: false,
      selectedIDs: this.selectedIDs,
    });

    this.allGroupsCollapsed =
      this.listOptions.length === this.listHeaders.length;
  }

  headerSelect(header: ListHeader): void {
    header.selected = this.getHeaderSelect(header);
    const groupOptionsIds = chain(this.options)
      .filter(group => this.isSameGroup(header, group))
      .flatMap('options')
      .filter(option => !option.disabled)
      .flatMap('id')
      .value();
    this.selectedIDs = header.selected
      ? chain(this.selectedIDs)
          .concat(groupOptionsIds)
          .concat(this.getSelectedDisabledMap())
          .uniq()
          .value()
      : chain(this.selectedIDs)
          .difference(groupOptionsIds)
          .concat(this.getSelectedDisabledMap())
          .uniq()
          .value();

    this.emitChange();
    this.updateActionButtonsState();

    this.updateLists({
      updateListHeaders: false,
      updateListOptions: false,
      selectedIDs: this.selectedIDs,
    });
  }

  optionClick(option: ListOption): void {
    if (!option.disabled) {
      option.selected = !option.selected;

      this.selectedIDs = option.selected
        ? chain(this.selectedIDs)
            .concat(option.id)
            .uniq()
            .value()
        : chain(this.selectedIDs)
            .difference([option.id])
            .value();

      console.log('optionClick selectedIDs', this.selectedIDs);

      this.updateLists({
        updateListHeaders: false,
        updateListOptions: false,
        selectedIDs: this.selectedIDs,
      });

      this.emitChange();
      this.updateActionButtonsState();
    }
  }

  onClear(): void {
    this.selectedIDs = this.getSelectedDisabledMap();

    this.emitChange();
    this.updateActionButtonsState(true);

    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.options
    );
  }

  onReset(): void {
    this.ngOnChanges(
      simpleChange({
        options: cloneDeep(this.optionsDefault),
      })
    );
    this.listActionsState.apply.disabled = false;
    this.emitChange();
  }

  getListChange(): ListChange {
    return this.listChangeService.getListChange(this.options, this.selectedIDs);
  }

  private getSelectedIDs(
    options: SelectGroupOption[] = this.options
  ): (string | number)[] {
    return this.listModelService.getSelectedIDs(options);
  }

  private emitChange(): void {
    const listChange: ListChange = this.listChangeService.getListChange(
      this.options,
      this.selectedIDs
    );

    this.options = listChange.getSelectGroupOptions();

    this.listActionsState.apply.disabled = false;

    this.selectChange.emit(listChange);
  }

  private getSelectedDisabledMap(): (string | number)[] {
    return chain(this.options)
      .flatMap('options')
      .filter(o => o.selected && o.disabled)
      .flatMap('id')
      .value();
  }

  private getHeaderSelect(header: ListHeader): boolean {
    const options = chain(this.options)
      .filter(group => this.isSameGroup(header, group))
      .flatMap('options')
      .filter(o => !(o.disabled && !o.selected))
      .value();
    return !options.every(o => o.selected);
  }

  private updateActionButtonsState(
    forceClear: boolean = null,
    forceReset: boolean = null
  ) {
    this.listActionsState.clear.hidden =
      forceClear !== null
        ? forceClear
        : !this.selectedIDs || this.selectedIDs.length === 0;

    this.listActionsState.reset.hidden =
      forceReset !== null
        ? forceReset
        : !this.selectedIDs ||
          !this.optionsDefaultIDs ||
          isEqual(this.selectedIDs.sort(), this.optionsDefaultIDs.sort());
  }
}

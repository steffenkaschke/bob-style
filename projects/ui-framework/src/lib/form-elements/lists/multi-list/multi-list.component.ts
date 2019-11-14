import {
  Component,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ChangeDetectorRef,
  NgZone,
  Input,
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { cloneDeep, flatMap, chain } from 'lodash';
import { ListHeader, ListOption, SelectGroupOption } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { DISPLAY_SEARCH_OPTION_NUM } from '../list.consts';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListChange } from '../list-change/list-change';
import {
  hasChanges,
  notFirstChanges,
  isNotEmptyArray,
} from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';

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
    DOM: DOMhelpers
  ) {
    super(
      renderer,
      listKeyboardService,
      listModelService,
      listChangeService,
      cd,
      zone,
      DOM
    );
    this.listActions = {
      clear: true,
      reset: false,
      apply: false,
    };
  }

  @Input() startWithGroupsCollapsed = true;

  public selectedIDs: (string | number)[];
  private optionsDraft: SelectGroupOption[];

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (hasChanges(changes, ['options', 'showSingleGroupHeader'])) {
      this.optionsDraft = this.options;
      this.selectedIDs = this.getSelectedIDs();
      this.filteredOptions = cloneDeep(this.options);
      this.shouldDisplaySearch =
        this.options &&
        flatMap(this.options, 'options').length > DISPLAY_SEARCH_OPTION_NUM;

      this.noGroupHeaders =
        !this.options ||
        (this.options.length < 2 && !this.showSingleGroupHeader);

      this.updateLists(
        this.startWithGroupsCollapsed && this.options.length > 1
      );
      this.updateClearButtonState();
    }

    if (
      notFirstChanges(changes, ['options']) &&
      isNotEmptyArray(changes.options.previousValue)
    ) {
      this.listActionsState.apply.disabled = false;
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
    this.listOptions = this.listModelService.getOptionsModel(
      this.filteredOptions,
      this.listHeaders,
      this.noGroupHeaders
    );
    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  headerSelect(header: ListHeader): void {
    header.selected = this.getHeaderSelect(header);
    const groupOptionsIds = chain(this.options)
      .filter(group => group.groupName === header.groupName)
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
    this.updateClearButtonState();

    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
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

      this.emitChange();
      this.updateClearButtonState();

      this.listModelService.setSelectedOptions(
        this.listHeaders,
        this.listOptions,
        this.optionsDraft
      );
    }
  }

  onClear(): void {
    this.selectedIDs = this.getSelectedDisabledMap();

    this.emitChange();
    this.updateClearButtonState(true);

    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  onReset(): void {}

  searchChange(searchValue: string): void {
    this.searchValue = searchValue;
    this.filteredOptions = this.listModelService.getFilteredOptions(
      this.options,
      searchValue
    );
    this.updateLists(this.startWithGroupsCollapsed && !searchValue);
  }

  getListChange(): ListChange {
    return this.listChangeService.getListChange(this.options, this.selectedIDs);
  }

  private updateLists(collapseHeaders = false): void {
    this.listHeaders = this.listModelService.getHeadersModel(
      this.filteredOptions,
      collapseHeaders
    );
    this.listOptions = this.listModelService.getOptionsModel(
      this.filteredOptions,
      this.listHeaders,
      this.noGroupHeaders
    );
    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  private getSelectedIDs(): (string | number)[] {
    return this.listModelService.getSelectedIDs(this.options);
  }

  private emitChange(): void {
    const listChange: ListChange = this.listChangeService.getListChange(
      this.options,
      this.selectedIDs
    );
    this.optionsDraft = listChange.getSelectGroupOptions();
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
    const options = chain(this.optionsDraft)
      .filter(group => group.groupName === header.groupName)
      .flatMap('options')
      .filter(o => !(o.disabled && !o.selected))
      .value();
    return !options.every(o => o.selected);
  }

  private updateClearButtonState(force: boolean = null) {
    this.listActionsState.clear.hidden =
      force !== null
        ? force
        : !this.selectedIDs || this.selectedIDs.length === 0;
  }
}

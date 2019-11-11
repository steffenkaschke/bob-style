import {
  Component,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ChangeDetectorRef,
  NgZone,
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
  applyChanges,
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
    private listModelService: ListModelService,
    private listChangeService: ListChangeService,
    renderer: Renderer2,
    listKeyboardService: ListKeyboardService,
    cd: ChangeDetectorRef,
    zone: NgZone,
    DOM: DOMhelpers
  ) {
    super(renderer, listKeyboardService, cd, zone, DOM);
    this.listActions = {
      clear: true,
      apply: false,
    };
    this.listActionsState = {
      clear: { disabled: true, hidden: false },
      apply: { disabled: true, hidden: false },
    };
  }

  public selectedIdsMap: (string | number)[];
  private optionsDraft: SelectGroupOption[];

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (hasChanges(changes, ['options', 'showSingleGroupHeader'])) {
      this.optionsDraft = this.options;
      this.selectedIdsMap = this.getSelectedIdsMap();
      this.filteredOptions = cloneDeep(this.options);
      this.shouldDisplaySearch =
        this.options &&
        flatMap(this.options, 'options').length > DISPLAY_SEARCH_OPTION_NUM;

      this.noGroupHeaders =
        !this.options ||
        (this.options.length < 2 && !this.showSingleGroupHeader);

      this.updateLists();
      this.updateClearButtonState();
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
    this.selectedIdsMap = header.selected
      ? chain(this.selectedIdsMap)
          .concat(groupOptionsIds)
          .concat(this.getSelectedDisabledMap())
          .uniq()
          .value()
      : chain(this.selectedIdsMap)
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
      this.selectedIdsMap = option.selected
        ? chain(this.selectedIdsMap)
            .concat(option.id)
            .uniq()
            .value()
        : chain(this.selectedIdsMap)
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
    this.selectedIdsMap = this.getSelectedDisabledMap();

    this.emitChange();
    this.updateClearButtonState(true);

    this.listModelService.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.optionsDraft
    );
  }

  searchChange(s: string): void {
    this.searchValue = s;
    this.filteredOptions = this.listModelService.getFilteredOptions(
      this.options,
      s
    );
    this.updateLists();
  }

  getListChange(): ListChange {
    return this.listChangeService.getListChange(
      this.options,
      this.selectedIdsMap
    );
  }

  private updateLists(): void {
    this.listHeaders = this.listModelService.getHeadersModel(
      this.filteredOptions
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

  private getSelectedIdsMap(): (string | number)[] {
    return this.listModelService.getSelectedIdsMap(this.options);
  }

  private emitChange(): void {
    const listChange: ListChange = this.listChangeService.getListChange(
      this.options,
      this.selectedIdsMap
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
    this.listActionsState.clear.disabled =
      force !== null
        ? force
        : !this.selectedIdsMap || this.selectedIdsMap.length === 0;
  }
}

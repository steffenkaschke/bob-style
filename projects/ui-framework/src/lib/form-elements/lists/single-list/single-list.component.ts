import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import {
  ListHeader,
  ListOption,
  SelectGroupOption,
  SelectOption
} from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { findIndex, flatMap, find } from 'lodash';
import { DISPLAY_SEARCH_OPTION_NUM } from '../list.consts';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListChange } from '../list-change/list-change';
import { hasChanges } from '../../../services/utils/functional-utils';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss']
})
export class SingleListComponent extends BaseListElement implements OnChanges {
  constructor(
    private listModelService: ListModelService,
    private listChangeService: ListChangeService,
    renderer: Renderer2,
    listKeyboardService: ListKeyboardService,
    cd: ChangeDetectorRef
  ) {
    super(renderer, listKeyboardService, cd);
    this.listActions = {
      clear: false,
      apply: false
    };
  }

  private selectedOption: SelectOption;

  @Input() showNoneOption = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['options', 'showSingleGroupHeader'])) {
      this.options = changes.options.currentValue;
      this.filteredOptions = this.options;
      this.shouldDisplaySearch =
        this.options &&
        flatMap(this.options, 'options').length > DISPLAY_SEARCH_OPTION_NUM;

      this.noGroupHeaders =
        !this.options ||
        (this.options.length < 2 && !this.showSingleGroupHeader);

      this.updateLists();
    }
  }

  headerClick(header: ListHeader): void {
    if (this.options.length > 1) {
      header.isCollapsed = !header.isCollapsed;
      this.listOptions = this.listModelService.getOptionsModel(
        this.filteredOptions,
        this.listHeaders,
        this.noGroupHeaders
      );
    }
  }

  optionClick(option: ListOption): void {
    if (!option.disabled) {
      if (this.selectedOption) {
        this.selectedOption.selected = false;
      }
      this.selectedOption = option;
      this.selectedOption.selected = true;
      this.focusIndex = findIndex(this.listOptions, o => o.selected);
      this.focusOption = option;

      this.emitChange();
    }
  }

  searchChange(s: string): void {
    this.searchValue = s;
    this.filteredOptions = this.listModelService.getFilteredOptions(
      this.options,
      s
    );
    this.updateLists();
  }

  getListHeight(): number {
    return (
      (this.listOptions.length + (this.showNoneOption ? 1 : 0)) *
      this.listElHeight
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
    this.selectedOption = find(this.listOptions, o => o.selected);
  }

  private emitChange(): void {
    const listChange = this.listChangeService.getListChange(this.options, [
      this.selectedOption.id
    ]);
    this.selectChange.emit(listChange);
  }
}

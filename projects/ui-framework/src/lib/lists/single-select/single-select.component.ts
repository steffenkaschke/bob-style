import {
  Component,
  forwardRef,
  Input,
  SimpleChanges,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain, isUndefined } from 'lodash';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import {
  BELOW_START,
  ABOVE_START,
  ABOVE_END,
  BELOW_END,
} from '../../popups/panel/panel-position-service/panel-position.const';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { isNullOrUndefined } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-single-select',
  templateUrl: 'single-select.component.html',
  styleUrls: [
    '../../input/input.component.scss',
    'single-select.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: SingleSelectComponent },
  ],
})
export class SingleSelectComponent extends BaseSelectPanelElement {
  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
    private listChangeService: ListChangeService
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
    this.value = null;
    this.panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
    this.listActions = {
      clear: false,
      apply: false,
      reset: false,
    };
  }

  @Input() showSingleGroupHeader = false;

  public selectedOptionId: number | string;

  // extends BaseSelectPanelElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.selectedOptionId = this.getSelectedOptionId(this.options);
    }
    this.displayValue = isNullOrUndefined(this.selectedOptionId)
      ? null
      : this.getDisplayValue(this.selectedOptionId);
  }

  onSelect(listChange: ListChange) {
    this.selectedOptionId = listChange.getSelectedIds()[0];
    this.displayValue = this.getDisplayValue(this.selectedOptionId);
    this.emitChange(listChange);
    this.destroyPanel();
  }

  clearSelection(): void {
    this.selectedOptionId = null;
    this.displayValue = this.getDisplayValue(this.selectedOptionId);
    const listChange = this.listChangeService.getListChange(this.options, []);
    this.emitChange(listChange);
    this.destroyPanel();
  }

  private getDisplayValue(selectedOptionId: string | number): string {
    return chain(this.options)
      .flatMap('options')
      .filter(option => option.id === selectedOptionId)
      .first()
      .get('value', null)
      .value();
  }

  private getSelectedOptionId(options: SelectGroupOption[]): number | string {
    return chain(options)
      .flatMap('options')
      .filter(o => o.selected)
      .flatMap('id')
      .first()
      .value();
  }

  private emitChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
    const selectedValue = listChange.getSelectedIds()[0];

    this.propagateChange(isUndefined(selectedValue) ? null : selectedValue);
    this.onTouched();
  }
}

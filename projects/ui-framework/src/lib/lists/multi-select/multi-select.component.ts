import {
  Component,
  EventEmitter,
  forwardRef,
  Output,
  SimpleChanges,
  ViewContainerRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain, includes } from 'lodash';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { ListFooterActions } from '../list.interface';
import { TruncateTooltipComponent } from '../../popups/truncate-tooltip/truncate-tooltip.component';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import {
  BELOW_START,
  ABOVE_START,
  BELOW_END,
  ABOVE_END,
} from '../../popups/panel/panel-position-service/panel-position.const';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { isNotEmptyArray } from '../../services/utils/functional-utils';
import { FormEvents } from '../../form-elements/form-elements.enum';

@Component({
  selector: 'b-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    '../single-select/single-select.component.scss',
    'multi-select.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: MultiSelectComponent },
  ],
})
export class MultiSelectComponent extends BaseSelectPanelElement {
  constructor(
    listChangeService: ListChangeService,
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
    private listModelService: ListModelService
  ) {
    super(
      listChangeService,
      overlay,
      viewContainerRef,
      panelPositionService,
      utilsService,
      DOM,
      zone,
      cd
    );
    this.panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
    this.listActions = {
      clear: true,
      reset: false,
      apply: true,
    };
  }

  @ViewChild('triggerInput', { static: true })
  truncate: TruncateTooltipComponent;

  @Output() selectModified: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() selectCancelled: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  public selectedIDs: (number | string)[];
  public displayValueCount: number;

  readonly listActions: ListFooterActions = {
    clear: true,
    apply: true,
  };

  // extends BaseSelectPanelElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.selectedIDs = isNotEmptyArray(this.options)
        ? this.listModelService.getSelectedIDs(this.options)
        : [];

      this.setDisplayValue();
    }
  }

  onSelect(listChange: ListChange): void {
    this.selectedIDs = listChange.getSelectedIds();
    this.emitChange(FormEvents.selectModified, listChange);
  }

  onApply(): void {
    this.setDisplayValue();
    this.emitChange(FormEvents.selectChange);
    this.destroyPanel();
  }

  onCancel(): void {
    this.selectedIDs = this.listModelService.getSelectedIDs(this.options);
    this.emitChange(FormEvents.selectCancelled);
    this.destroyPanel();
  }

  private setDisplayValue(): void {
    this.displayValue = this.getDisplayValue(this.selectedIDs);
    this.displayValueCount = this.selectedIDs.length;
  }

  private getDisplayValue(selectedIDs: (string | number)[]): string {
    return chain(this.options)
      .flatMap('options')
      .filter(option => includes(selectedIDs, option.id))
      .map('value')
      .join(', ')
      .value();
  }

  private emitChange(event: FormEvents, listChange: ListChange = null): void {
    listChange =
      listChange ||
      this.listChangeService.getListChange(this.options, this.selectedIDs);

    if (this[event].observers.length > 0) {
      this[event].emit(listChange);
    }

    if (event === FormEvents.selectChange) {
      this.options = listChange.getSelectGroupOptions();

      if (this.changed.observers.length > 0) {
        this.changed.emit(this.selectedIDs);
      }
      if (this.doPropagate) {
        this.propagateChange(this.selectedIDs);
        this.onTouched();
      }
    }
  }
}

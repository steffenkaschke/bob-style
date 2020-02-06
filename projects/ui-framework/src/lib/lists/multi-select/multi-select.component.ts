import {
  Component,
  EventEmitter,
  forwardRef,
  Output,
  ViewContainerRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { SelectOption } from '../list.interface';
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
import { FormEvents } from '../../form-elements/form-elements.enum';
import { arrayFlatten } from '../../services/utils/functional-utils';
import { SelectType } from '../list.enum';

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
    listChangeSrvc: ListChangeService,
    modelSrvc: ListModelService,
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef
  ) {
    super(
      listChangeSrvc,
      modelSrvc,
      overlay,
      viewContainerRef,
      panelPositionService,
      utilsService,
      DOM,
      zone,
      cd
    );
    this.type = SelectType.multi;
    this.panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
    this.listActions = {
      apply: true,
      cancel: true,
      clear: true,
      reset: false,
    };
  }

  @ViewChild('input', { static: true, read: TruncateTooltipComponent })
  truncate: TruncateTooltipComponent;

  @Output() selectModified: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() selectCancelled: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  onApply(): void {
    if (this.listChange) {
      this.emitChange(FormEvents.selectChange);
    }
    this.destroyPanel();
  }

  onCancel(): void {
    this.value = this.modelSrvc.getSelectedIDs(this.options);
    this.setDisplayValue();
    this.emitChange(
      FormEvents.selectCancelled,
      this.listChangeSrvc.getListChange(this.options, this.value)
    );
    this.destroyPanel();
  }

  protected getDisplayValue(): string {
    return (
      this.value &&
      this.options &&
      arrayFlatten(this.options.map(group => group.options))
        .filter((option: SelectOption) => this.value.includes(option.id))
        .map((option: SelectOption) => option.value)
        .join(', ')
    );
  }

  protected emitChange(
    event: FormEvents,
    listChange: ListChange = this.listChange
  ): void {
    // listChange =
    //   listChange || this.listChangeSrvc.getListChange(this.options, this.value);

    if (this[event].observers.length > 0) {
      this[event].emit(listChange);
    }

    if (event === FormEvents.selectChange) {
      this.options = listChange.getSelectGroupOptions();

      if (this.changed.observers.length > 0) {
        this.changed.emit(this.value);
      }

      if (this.doPropagate) {
        this.propagateChange(this.value);
        this.onTouched();
      }
    }
  }
}

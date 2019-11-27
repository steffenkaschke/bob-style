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
  Input,
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
    listChangeSrvc: ListChangeService,
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
    private modelSrvc: ListModelService
  ) {
    super(
      listChangeSrvc,
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

  @Input() value: (number | string)[];

  @Output() selectModified: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() selectCancelled: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  readonly listActions: ListFooterActions = {
    clear: true,
    apply: true,
  };

  // extends BaseSelectPanelElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.value = isNotEmptyArray(this.options)
        ? this.modelSrvc.getSelectedIDs(this.options)
        : [];

      this.setDisplayValue();
    }
  }

  onSelect(listChange: ListChange): void {
    this.value = listChange.getSelectedIds();
    this.emitChange(FormEvents.selectModified, listChange);
  }

  onApply(): void {
    this.setDisplayValue();
    this.emitChange(FormEvents.selectChange);
    this.destroyPanel();
  }

  onCancel(): void {
    this.value = this.modelSrvc.getSelectedIDs(this.options);
    this.emitChange(FormEvents.selectCancelled);
    this.destroyPanel();
  }

  private setDisplayValue(): void {
    this.displayValue = this.getDisplayValue(this.value);
    this.displayValueCount = this.value.length;
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
      listChange || this.listChangeSrvc.getListChange(this.options, this.value);

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

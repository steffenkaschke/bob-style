import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewContainerRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain, includes } from 'lodash';
import { PanelPositionService } from '../../../popups/panel/panel-position-service/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { ListFooterActions } from '../list.interface';
import { TruncateTooltipComponent } from '../../../popups/truncate-tooltip/truncate-tooltip.component';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { UtilsService } from '../../../services/utils/utils.service';
import {
  BELOW_START,
  ABOVE_START,
  BELOW_END,
  ABOVE_END,
} from '../../../popups/panel/panel-position-service/panel-position.const';
import { isNotEmptyArray } from '../../../services/utils/functional-utils';

@Component({
  selector: 'b-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: [
    '../../input/input.component.scss',
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
  ],
})
export class MultiSelectComponent extends BaseSelectPanelElement
  implements OnChanges {
  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
    private listChangeService: ListChangeService,
    private listModelService: ListModelService
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
    this.panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
    this.listActions = {
      clear: true,
      reset: false,
      apply: true,
    };
  }

  @ViewChild('triggerInput', { static: true })
  truncate: TruncateTooltipComponent;

  @Input() showSingleGroupHeader = false;
  @Input() startWithGroupsCollapsed = true;

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

  private listChange: ListChange;

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes.options) {
      this.selectedIDs = isNotEmptyArray(this.options)
        ? this.getSelectedIDs(this.options)
        : [];

      this.setDisplayValue();
    }
  }

  onSelect(listChange: ListChange): void {
    this.selectedIDs = listChange.getSelectedIds();
    this.listChange = listChange;
    this.emitSelectModified(listChange);
  }

  cancelSelection(): void {
    this.onCancel();
  }

  onCancel(): void {
    this.selectedIDs = this.getSelectedIDs(this.options);
    this.destroyPanel();
    this.selectCancelled.emit(this.getListChange());
  }

  onApply(): void {
    this.setDisplayValue();
    this.emitSelectChange(this.getListChange());
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

  private getSelectedIDs(options: SelectGroupOption[]): (number | string)[] {
    return this.listModelService.getSelectedIDs(options);
  }

  private getListChange(): ListChange {
    return this.listChangeService.getListChange(this.options, this.selectedIDs);
  }

  private emitSelectChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
    const selectedValue = listChange.getSelectedIds();
    this.propagateChange(selectedValue);
    this.onTouched();
  }

  private emitSelectModified(listChange: ListChange): void {
    this.selectModified.emit(listChange);
  }
}

import {
  Component,
  ChangeDetectorRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  forwardRef,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { BaseFormElement } from '../../form-elements/base-form-element';
import {
  TreeListOption,
  itemID,
  ViewFilter,
  TreeListComponentIO,
  TreeListKeyMap,
  TreeListValue,
  TreeListItemMap,
} from '../tree-list/tree-list.interface';
import { SelectType } from '../list.enum';
import { ListFooterActions } from '../list.interface';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { OverlayRef } from '@angular/cdk/overlay';
import { TreeListPanelComponent } from '../tree-list-panel/tree-list-panel.component';
import { BTL_KEYMAP_DEF } from '../tree-list/tree-list.const';
import {
  BELOW_START,
  ABOVE_START,
  BELOW_END,
  ABOVE_END,
} from '../../popups/panel/panel-position-service/panel-position.const';
import {
  InputEventType,
  FormEvents,
} from '../../form-elements/form-elements.enum';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import {
  hasChanges,
  isNotEmptyArray,
  isNotEmptyMap,
  isArray,
  asArray,
  notFirstChanges,
} from '../../services/utils/functional-utils';
import { TooltipClass } from '../../popups/tooltip/tooltip.enum';
import { TreeListPanelIO } from '../tree-list-panel/tree-list-panel.interface';
import { TreeListModelService } from '../tree-list/services/tree-list-model.service';
import { selectValueOrFail } from '../../services/utils/transformers';

@Component({
  selector: 'b-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    './tree-select.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: TreeSelectComponent },
  ],
})
export class TreeSelectComponent extends BaseFormElement
  implements TreeListComponentIO, TreeListPanelIO, OnDestroy {
  constructor(private modelSrvc: TreeListModelService, cd: ChangeDetectorRef) {
    super(cd);
    this.baseValue = [];
    this.inputTransformers = [selectValueOrFail];
    this.wrapEvent = true;
  }

  @ViewChild(TreeListPanelComponent, { static: true })
  listPanel: TreeListPanelComponent;

  @Input() list: TreeListOption[];
  @Input('value') set setValue(value: itemID[]) {
    console.log('---------------', 'Tree Select setValue', value);
    this.writeValue(value);
  }
  public value: itemID[];
  @Input() valueDefault: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = '/';
  @Input() maxHeightItems = 8;
  @Input() startCollapsed = true;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() listActions: ListFooterActions = {
    apply: true,
    cancel: true,
    clear: true,
    reset: false,
  };
  @Input() tooltipType: TruncateTooltipType = TruncateTooltipType.auto;
  @Input() debug = false;

  @Output() changed: EventEmitter<TreeListValue> = new EventEmitter<
    TreeListValue
  >();
  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter<OverlayRef>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  public itemsMap: TreeListItemMap = new Map();
  public overlayRef: OverlayRef;
  public panelOpen = false;
  public displayValue: string;
  public displayValueCount: number;
  public panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
  public panelClass = 'b-tree-select-panel';
  public treeListValue: TreeListValue;
  readonly tooltipClass = [TooltipClass.PreWrap];
  public dirty = false;
  public touched = false;

  public onNgChanges(changes: SimpleChanges): void {
    console.log('---------------', 'Tree Select ngOnChanges', changes);

    if (hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage'])) {
      this.closePanel();
    }

    if (
      notFirstChanges(changes, ['type']) &&
      this.type !== SelectType.multi &&
      isNotEmptyArray(this.value, 1)
    ) {
      console.log('select deselectAllItemsInMap');
      this.value = [this.value[0]];
      this.modelSrvc.deselectAllItemsInMap(this.itemsMap);
    }

    if (hasChanges(changes, ['list'], true)) {
      console.log('????>>>>>><<<<<<<<<??????');
      console.time('getListItemsMap (select)');

      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
        separator: this.valueSeparatorChar,
        collapsed: this.startCollapsed,
      });
      console.timeEnd('getListItemsMap (select)');

      if (isNotEmptyArray(this.value)) {
        this.setDisplayValue(this.value);
      }
    }
  }

  ngOnDestroy(): void {
    this.itemsMap.clear();
  }

  public onSelectChange(value: TreeListValue): void {
    this.treeListValue = value;
    this.setDisplayValue(value);
  }

  public onApply(): void {
    this.value = (this.treeListValue && this.treeListValue.selectedIDs) || [];
    this.dirty = true;
    this.emitChange(this.treeListValue);
    this.treeListValue = undefined;
  }

  public onCancel(): void {
    this.setDisplayValue(this.treeListValue);
    this.closePanel();
    this.treeListValue = undefined;
  }

  private setDisplayValue(value: TreeListValue | itemID[] = null): void {
    const selectedValues =
      value && (value as TreeListValue).selectedValues
        ? (value as TreeListValue).selectedValues
        : value && isNotEmptyMap(this.itemsMap)
        ? asArray(value as itemID[])
            .map(id =>
              this.itemsMap.get(id) ? this.itemsMap.get(id).value : null
            )
            .filter(Boolean)
        : [];

    console.log('setDisplayValue', value, selectedValues);

    this.displayValue =
      (this.type === SelectType.single
        ? selectedValues[0]
        : selectedValues.join(',\n')) || '';
  }

  public writeValue(value: itemID[]) {
    console.log('---------------', 'Tree Select writeValue', value);
    super.writeValue(value);

    if (isNotEmptyMap(this.itemsMap)) {
      this.setDisplayValue(this.value);
    }
  }

  private emitChange(value: TreeListValue): void {
    console.log('====> Select emitChange', value);

    this.transmitValue(value.selectedIDs, {
      eventType: [InputEventType.onChange],
      emitterName: FormEvents.changed,
      doPropagate: true,
      addToEventObj: {
        selectedValues: value.selectedValues,
      },
      eventObjValueKey: 'selectedIDs',
      eventObjOmitEventType: true,
      updateValue: true,
    });
  }

  public openPanel(): void {
    if (this.listPanel && !this.disabled) {
      this.listPanel.openPanel();
    }
  }

  public closePanel(): void {
    if (this.listPanel) {
      this.listPanel.closePanel();
    }
  }

  public onPanelOpen(overlayRef: OverlayRef): void {
    this.overlayRef = overlayRef;
    this.panelOpen = true;
    if (this.opened.observers.length) {
      this.opened.emit(this.overlayRef);
    }
  }

  public onPanelClose(): void {
    this.touched = true;
    this.overlayRef = null;
    this.panelOpen = false;
    if (this.closed.observers.length) {
      this.closed.emit();
    }
  }
}

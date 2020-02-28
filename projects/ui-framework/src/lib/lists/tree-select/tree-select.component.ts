import {
  Component,
  ChangeDetectorRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  forwardRef,
  SimpleChanges,
} from '@angular/core';
import { BaseFormElement } from '../../form-elements/base-form-element';
import {
  TreeListOption,
  itemID,
  ViewFilter,
  TreeListComponentIO,
  TreeListKeyMap,
  TreeListValue,
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
} from '../../services/utils/functional-utils';
import { TooltipClass } from '../../popups/tooltip/tooltip.enum';
import { TreeListPanelIO } from '../tree-list-panel/tree-list-panel.interface';

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
  implements TreeListComponentIO, TreeListPanelIO {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
    // this.baseValue = [];
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

  public overlayRef: OverlayRef;
  public panelOpen = false;
  public displayValue: string;
  public displayValueCount: number;
  public panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
  public panelClass = 'b-tree-select-panel';
  public treeListValue: TreeListValue;
  readonly tooltipClass = [TooltipClass.PreWrap];

  public onNgChanges(changes: SimpleChanges): void {
    console.log('---------------', 'Tree Select ngOnChanges', changes);

    if (hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage'])) {
      this.closePanel();
    }
  }

  public onSelectChange(value: TreeListValue): void {
    this.treeListValue = value;
    this.setDisplayValue(value);
  }

  public onApply(): void {
    this.value = (this.treeListValue && this.treeListValue.selectedIDs) || [];
    this.emitChange(this.treeListValue);
    this.treeListValue = undefined;
  }

  public onCancel(): void {
    this.setDisplayValue(this.treeListValue);
    this.closePanel();
    this.treeListValue = undefined;
  }

  private setDisplayValue(value: TreeListValue = null): void {
    if (this.type === SelectType.single) {
      this.displayValue =
        (value && value.selectedValues && value.selectedValues[0]) || '';
    }
    if (this.type === SelectType.multi) {
      this.displayValue =
        value && isNotEmptyArray(value.selectedValues)
          ? value.selectedValues.join(',\n')
          : '';
    }
  }

  public writeValue(value: itemID[]) {
    console.log('---------------', 'Tree Select writeValue', value);
    super.writeValue(value);
    /// GET DISPLAY VALUE
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
    this.overlayRef = null;
    this.panelOpen = false;
    if (this.closed.observers.length) {
      this.closed.emit();
    }
  }
}

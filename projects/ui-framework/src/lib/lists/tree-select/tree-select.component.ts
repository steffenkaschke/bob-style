import { Component, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import { BaseFormElement } from '../../form-elements/base-form-element';
import {
  TreeListOption,
  itemID,
  ViewFilter,
} from '../tree-list/tree-list.interface';
import { SelectType } from '../list.enum';
import { ListFooterActions } from '../list.interface';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

@Component({
  selector: 'b-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    './tree-select.component.scss',
  ],
})
export class TreeSelectComponent extends BaseFormElement {
  constructor(zone: NgZone, cd: ChangeDetectorRef) {
    super(cd);
  }

  @Input() list: TreeListOption[];
  @Input() value: itemID[];
  @Input() viewFilter: ViewFilter;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = '/';
  @Input() maxHeightItems = 8;
  @Input() showSingleGroupHeader = false;
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

  public panelOpen = false;
  public displayValue: string;
  public displayValueCount: number;
  public positionClassList = {};

  public writeValue(value: any): void {}

  public openPanel(): void {}

  public closePanel(): void {}

  public onApply(): void {}

  public onCancel(): void {}

  public onSelect(): void {}

  private emitChange(): void {}
}
